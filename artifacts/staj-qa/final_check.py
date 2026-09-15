from docx import Document
from pathlib import Path
p=Path('artifacts/GameCodex_20_Gunluk_Staj_Raporu.docx')
d=Document(p)
assert len(d.sections)==20
assert len(d.inline_shapes)==20
assert len({str(s.header.part.partname) for s in d.sections})==20
print('Verified: 20 daily sections, 20 figures, 20 independent date headers.')
print('File size:',p.stat().st_size)
