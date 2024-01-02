# pip install aspose-words
# export PYTHONIOENCODING=utf-8

import sys
import aspose.words as aw

file_path = sys.argv[1]

mhtml_file_path = f"{file_path}.mhtml"
html_file_path = f"{file_path}.html"

doc = aw.Document(mhtml_file_path)
doc.save(html_file_path)
