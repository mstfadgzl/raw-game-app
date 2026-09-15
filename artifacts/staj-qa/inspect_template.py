from zipfile import ZipFile
from lxml import etree as E
from pathlib import Path
z=ZipFile(Path('C:/Users/musta/Downloads/rapor sayfası.docx'))
ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
x=E.fromstring(z.read('word/document.xml'))
print('Texts:',x.xpath('//w:t/text()',namespaces=ns))
print('Shapes:',len(x.xpath('//*[local-name()="shape"]')))
print('Drawing:',len(x.xpath('//w:drawing',namespaces=ns)))
print('Sections:',E.tostring(x.find('.//w:sectPr',ns)).decode()[:1800])
print('App props:',z.read('docProps/app.xml').decode())
print('Paragraphs with drawing',[(i,E.tostring(p).decode()[:8000]) for i,p in enumerate(x.find('w:body',ns)) if p.xpath('.//w:drawing|.//w:pict',namespaces=ns)][:3])
print('Header parts:',[n for n in z.namelist() if n.startswith('word/header') or n.startswith('word/footer')])
