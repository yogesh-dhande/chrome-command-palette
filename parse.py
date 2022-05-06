from html.parser import HTMLParser
import string
import random

def generate_id():
    return ''.join([random.choice(string.ascii_lowercase) for _ in range(4)])

class MyHTMLParser(HTMLParser):

    def __init__(self, *args, **kwargs):
        super(MyHTMLParser, self).__init__(*args, **kwargs)
        self.document = ''
        self.class_str = ''
        self.classes_by_id = {}

    def handle_starttag(self, tag, attrs):
        self.document = f"{self.document}<{tag}"

        attrs_dict = dict(attrs)

        id = attrs_dict.setdefault("id", generate_id())

        class_str = attrs_dict.pop("class", "")
        if self.class_str:
            class_str = f"{self.class_str} {class_str}"
        self.class_str = class_str

        for k, v in attrs_dict.items():
            self.document = f'{self.document} {k}="{v}"'

        self.document += ">"
        self.classes_by_id[id] = class_str

        if tag == "body":
            self.body_parsed = True

    def handle_endtag(self, tag):
        self.document = f"{self.document}</{tag}>"

    def handle_data(self, data):
        self.document += data

parser = MyHTMLParser()

with open("Popup.vue", "r") as file:
    parser.feed(file.read())


print(parser.classes_by_id)

parser.document += "\n<style scoped>\n"

for id, class_str in parser.classes_by_id.items():
    if class_str:
        parser.document += f"#{id} {{ @apply {class_str} }}\n\n"

parser.document += "</style>"

with open("src/content-scripts/Popup.vue", "w+") as out_file:
    out_file.write(parser.document)