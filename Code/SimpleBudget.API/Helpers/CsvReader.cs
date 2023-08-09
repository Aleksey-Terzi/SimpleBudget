using System.Text;

namespace SimpleBudget.API
{
    public static class CsvReader
    {
        const char Separator = ',';
        const char Quote = '"';

        public static string[][] Read(string file, int? columns)
        {
            var result = new List<string[]>();

            using var reader = new StringReader(file);

            var lineNumber = 1;

            string? line;
            while ((line = reader.ReadLine()) != null)
            {
                var values = ParseLine(lineNumber, line);
                result.Add(values);

                lineNumber++;
            }

            if (columns.HasValue)
                Validate(result, columns.Value);

            return result.ToArray();
        }

        private static void Validate(List<string[]> lines, int columns)
        {
            for (int i = 0; i < lines.Count; i++)
            {
                var current = lines[i].Length;

                if (current != columns)
                    throw new ArgumentException($"It is expected {columns} column(s) but line {i + 1} has {current} column(s)");
            }
        }

        private static string[] ParseLine(int lineNumber, string line)
        {
            var index = SkipSpaces(line, 0);

            var isPrevQuote = false;
            var isValueQuoted = false;
            var isQuoteClosed = false;

            var result = new List<string>();
            var value = new StringBuilder();

            while (index < line.Length)
            {
                var c = line[index];

                if (c == Separator && (isQuoteClosed || value.Length == 0))
                {
                    result.Add(value.ToString());
                    value.Clear();

                    isPrevQuote = false;
                    isValueQuoted = false;
                    isQuoteClosed = false;

                    index = SkipSpaces(line, index + 1);

                    continue;
                }

                if (c == Quote)
                {
                    if (!isValueQuoted)
                    {
                        if (value.Length > 0)
                            throw new ArgumentException($"Unexpected double quota character at line {lineNumber} and position {index + 1}");

                        isValueQuoted = true;
                    }
                    else if (isQuoteClosed)
                    {
                        if (!isPrevQuote)
                            throw new ArgumentException($"Unexpected double quota character at line {lineNumber} and position {index + 1}");

                        isQuoteClosed = false;
                        isPrevQuote = false;
                        value.Append(Quote);
                    }
                    else
                    {
                        isQuoteClosed = true;
                        isPrevQuote = true;
                    }
                }
                else if (isQuoteClosed && isValueQuoted)
                {
                    if (c != ' ')
                        throw new ArgumentException($"Separator character is expected at line {lineNumber} and position {index + 1}");
                }
                else
                {
                    if (value.Length == 0 && !isValueQuoted)
                        isQuoteClosed = true;

                    isPrevQuote = false;
                    value.Append(c);
                }

                index++;
            }

            if (isValueQuoted && !isQuoteClosed)
                throw new ArgumentException($"The value is not enclosed at line {lineNumber}");

            result.Add(value.ToString());

            return result.ToArray();
        }

        private static int SkipSpaces(string line, int index)
        {
            while (index < line.Length && line[index] == ' ')
                index++;

            return index;
        }
    }
}
