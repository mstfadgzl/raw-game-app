 
 ---  başlangıç
npx [@react-native-community/cli@latest init RawgGameApp] yazarak klasör oluşturdum
app klasörü oluşturup içerisine api/assets/compnents/hooks/navigators/redux/screens/types/utils klasörleri oluşturdum

--1. adım interface oluşturma 




--api kısmı
backand elimde oluğu için ilk başta api içerisine index.ts oluşturdum daha sonra .env kullanmak için {npm i dotenv} indirdim.. daha sonra .env oluşturup içerisine api key ve api url yazdım ki bunu api/index.ts içine çekebileyim. daha sonra api/index.ts içine const olarak apileri çağırdım faka react native kullandığım için {npm install react-native-config } indirdim çünkü react native için .env den bu şekilde çekeceğiz.. 
alias eklemek için tsconfig.json sayfasına gidiyoruz ve compıleroptions içine path içine alias ekliyoruz 
babel de anlaması için {npm i babel-plugin-module-resolver} kullanıyoruz sonra aliaslarımızı tsconfig.json ve babel.config.js içine yazıyoruz ve bunları .eslintrc.js içine yazıyoruz


