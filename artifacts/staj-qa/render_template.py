import fitz
p=fitz.open('artifacts/staj-qa/template.pdf');print('Pages',len(p))
p[0].get_pixmap(matrix=fitz.Matrix(1.2,1.2)).save('artifacts/staj-qa/template.png')
print(p[0].get_text())
