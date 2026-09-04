 
 ---  başlangıç
npx [@react-native-community/cli@latest init RawgGameApp] yazarak klasör oluşturdum
app klasörü oluşturup içerisine api/assets/compnents/hooks/navigators/redux/screens/types/utils klasörleri oluşturdum

--1. adım interface oluşturma 
interfaceleri postman yardımıyla oluşturuyoruz

--2.adım
backand elimde olduğu için ilk başta api içerisine index.ts oluşturdum daha sonra .env kullanmak için {npm i dotenv} indirdim.. daha sonra .env oluşturup içerisine api key ve api url yazdım ki bunu api/index.ts içine çekebileyim. daha sonra api/index.ts içine const olarak apileri çağırdım faka react native kullandığım için {npm install react-native-config } indirdim çünkü react native için .env den bu şekilde çekeceğiz.. 
alias eklemek için tsconfig.json sayfasına gidiyoruz ve compıleroptions içine path içine alias ekliyoruz 
babel de anlaması için {npm i babel-plugin-module-resolver} kullanıyoruz sonra aliaslarımızı tsconfig.json ve babel.config.js içine yazıyoruz ve bunları .eslintrc.js içine yazıyoruz

-----2.1 adım api klasörünün içine client oluşturuyoruz ve interceptors / token yapısını kuruyoruz 

----2.2 adım api içine services klasöürü oluşturup her axios api isteklerimizi yazıyoruz farklı alanlar için farklı dosyalar açıp yazıyoruz

----2.3 adım redux klasörünün içine actions klasörü açıyoruz ve thunk işlemlerini buraya yazıyoruz 

---2.4 sliceları tek tek yazmak yerine utils içine redux helper oluşturuyoruz ve tüm sliceları ortak toplayacak bir yapı oluşturuyoruz daha sonra slice dsyasına gidip bu reduxhelperi import ediyoruz... daha sonra bunları configurestore diye store.ts dosyasına atıyoruz ondan sonra da hooks içine useappdispatch ve useappselector oluşturuyoruz




1.interface oluştur
2.servisleri yaz
3.action ları yaz ve actionları tekrar yazmamak için createAppAsyncThunk helperı yaz
4. sliceları yaz ve store.ts içine aktar