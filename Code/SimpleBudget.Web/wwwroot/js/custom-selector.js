$(document).ready(function () {

    $.fn.enableCustomSelector = function (enabled) {
        this.each(function () {
            var $input = $(this);
            var $root = $input.parent();
            var $button = $root.find("button");

            if (enabled) {
                $input.removeAttr("disabled");
                $button.removeAttr("disabled");
            } else {
                $input.attr("disabled", "disabled");
                $button.attr("disabled", "disabled");
            }
        });
    };


    $.fn.setCustomSelectorValue = function (text) {
        this.each(function () {
            var $input = $(this);
            var $root = $input.parent();
            var $menu = $root.find(".dropdown-menu");

            $menu.find("li > a").removeClass("active");

            $input.val(text);
            $input.trigger("change");

            if (!text)
                return false;

            text = text.toLowerCase();

            var list = $menu.find("li > a");
            $.each(list, function (index, a) {
                var $a = $(a);
                var optionText = $a.get(0).innerHTML;
                if (optionText.toLowerCase() == text) {
                    $a.addClass("active");
                    return false;
                }
            });

            return false;
        });
    };

    $.fn.isInCustomSelector = function () {
        var found = false;

        this.each(function () {
            var $input = $(this);
            var $root = $input.parent();
            var $menu = $root.find(".dropdown-menu");

            var text = $input.val();

            if (!text)
                return false;

            text = text.toLowerCase();

            var list = $menu.find("li");
            $.each(list, function (index, li) {
                var optionText = $(li).find("a").get(0).innerHTML;
                if (optionText.toLowerCase() == text) {
                    found = true;
                    return false;
                }
            });

            return false;
        });

        return found;
    };

    $(".custom-selector input[type=text]")
        .on("focus", function () {
            showDropDownMenu($(this).parent());
        })
        .on("blur", function (e) {
            var $root = $(this).parent();

            if (e.relatedTarget == $root.find("button").get(0))
                return;

            if (e.relatedTarget != null) {
                var $relatedTarget = $(e.relatedTarget);
                var $parent = $relatedTarget.parent().parent();

                if ($parent.length > 0 && $parent.get(0) == $root.find(".dropdown-menu").get(0))
                    selectMenuItem($relatedTarget.parent());
            }

            $root.find(".dropdown-menu").hide();
        })
        .on("keydown", function (e) {
            var $menu = $(this).parent().find(".dropdown-menu");

            switch (e.which) {
                case 13: // Enter
                case 27: // Esc
                    $menu.hide();
                    e.preventDefault();
                    break;
                case 38: // ArrowUp
                    moveUp($menu);
                    e.preventDefault();
                    break;
                case 40: // ArrowDown
                    moveDown($menu);
                    e.preventDefault();
                    break;
            }
        })
        .on("keyup", function (e) {
            switch (e.which) {
                case 13: // Enter
                case 27: // Esc
                case 38: // ArrowUp
                case 40: // ArrowDown
                    return;
            }

            filterMenuItems($(this));
        });

    $(".custom-selector .dropdown-toggle").on("click", function () {
        var $parent = $(this).parent();
        var $menu = $parent.find(".dropdown-menu");

        if ($menu.is(":visible")) {
            $menu.hide();
        } else {
            $parent.find("input[type=text]").focus();
        }
    });

    function moveUp($menu) {
        var $active = $menu.find("li > a.active").parent();
        var $prev;

        if ($active.length === 0) {
            $prev = $menu.find("li:visible").first();
        } else {
            $prev = $active.prev();
            while ($prev.length > 0 && !$prev.is(":visible"))
                $prev = $prev.prev();
        }

        if ($prev.length > 0)
            selectMenuItem($prev);
    }

    function moveDown($menu) {
        var $active = $menu.find("li > a.active").parent();
        var $next;

        if ($active.length === 0) {
            $next = $menu.find("li:visible").first();
        } else {
            $next = $active.next();
            while ($next.length > 0 && !$next.is(":visible"))
                $next = $next.next();
        }

        if ($next.length > 0)
            selectMenuItem($next);
    }

    function selectMenuItem($item) {
        var $menu = $item.parent();

        $menu.find("li > a").removeClass("active");

        var $a = $item.find("a");

        $a.addClass("active");

        scrollToMenuItem($item);

        var text = $a.html();
        var $input = $menu.parent().find("input[type=text]");

        $input.val(text);
        $input.trigger("change");
    }

    function filterMenuItems($input) {
        var $root = $input.parent();
        var $menu = $root.find(".dropdown-menu");

        if (!$menu.is(":visible")) {
            showDropDownMenu($root);
        }

        var text = $input.val();

        if (text) {
            text = text.toLowerCase();
        }

        $menu.find("li > a.active").removeClass("active");

        var list = $menu.find("li > a");
        $.each(list, function (index, a) {
            var $a = $(a);
            var optionText = $a.get(0).innerHTML;

            if (text == null || text.length == 0 || optionText.toLowerCase().includes(text)) {
                $a.parent().show();
            } else {
                $a.parent().hide();
            }
        });
    }

    function showDropDownMenu($root) {
        var $menu = $root.find(".dropdown-menu");

        if ($menu.is(":visible"))
            return;

        var $input = $root.find("input[type=text]");

        var inputWidth = $input.outerWidth();
        var inputHeight = $input.outerHeight();
        var buttonWidth = $root.find("button").outerWidth();
        var width = inputWidth + buttonWidth;

        $menu.css("width", String(width) + "px");
        $menu.css("margin-top", String(inputHeight + 2) + "px");
        $menu.css("margin-left", "-2px");
        $menu.show();

        scrollToMenuItem($menu.find("li > a.active").parent());
    }

    function scrollToMenuItem($item) {
        if ($item.length === 0)
            return;

        var $menu = $item.parent();
        var menuHeight = $menu.height();
        var itemHeight = $item.outerHeight();
        var itemTop = $item.position().top

        if (itemTop >= 0 && itemTop < menuHeight - itemHeight)
            return;

        scrollTop = $menu.scrollTop() + itemTop;

        if (itemTop > 0 || itemTop + itemHeight < 0)
            scrollTop += itemHeight - menuHeight

        $menu.scrollTop(scrollTop);
    }
});