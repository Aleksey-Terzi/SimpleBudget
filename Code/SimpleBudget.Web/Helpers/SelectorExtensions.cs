using System.Text;
using System.Web;

using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace SimpleBudget.Web.Helpers
{
    public static class SelectorExtensions
    {
        public static HtmlString Selector(this IHtmlHelper helper, string id, IEnumerable<string>? data, string? value = null, bool enabled = true, string? attributes = null)
        {
            var htmlValue = !string.IsNullOrEmpty(value) ? HttpUtility.HtmlEncode(value) : "";
            var disabledText = enabled ? "" : "disabled=disabled";

            var html = new StringBuilder();
            html.AppendLine($@"<div id=""{id}_wrap"" class=""input-group custom-selector"">");
            html.AppendLine($@"<input id=""{id}"" name=""{id}"" type=""text"" class=""form-control"" aria-label=""..."" value=""{htmlValue}"" {attributes} {disabledText}>");
            html.AppendLine($@"<button id=""{id}_button"" type=""button"" class=""btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"" aria-expanded=""false"" tabindex=-1 {disabledText}><span class=""caret""></span></button>");

            html.AppendLine($@"<ul class=""dropdown-menu dropdown-menu-right"" area-labelledby=""{id}_button"">");

            if (data != null)
            {
                foreach (var s in data)
                {
                    var activeClass = string.Equals(s, value, StringComparison.OrdinalIgnoreCase) ? " active" : "";

                    html.AppendLine($@"<li><a class=""dropdown-item{activeClass}"" href=""#"" tabindex=-1>{s}</a></li>");
                }
            }

            html.AppendLine("</ul>");
            html.AppendLine("</div>");

            return new HtmlString(html.ToString());
        }
    }
}
