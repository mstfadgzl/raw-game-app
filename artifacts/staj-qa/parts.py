from zipfile import ZipFile
from lxml import etree as E
z=ZipFile('C:/Users/musta/Downloads/rapor sayfası.docx')
for n in ['word/header1.xml','word/footer1.xml']:
 print(n); print(z.read(n).decode())
print(z.namelist())
