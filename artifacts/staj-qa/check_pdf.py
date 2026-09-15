from pypdf import PdfReader
p=PdfReader('artifacts/staj-qa/report.pdf');print('Total pages:',len(p.pages))
for i,page in enumerate(p.pages,1):
 text=page.extract_text()
 print(i, len(text), 'Figure', ('Şekil '+str(i)+'.') in text, text[:90].replace('\n',' '))
