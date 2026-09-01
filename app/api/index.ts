import Config from "react-native-config";
import axios from 'axios';
import API_URL from '@env';

const API_BASE_URL = Config.RAWG_BASE_URL;
const API_KEY = Config.RAWG_API_KEY;

const api = axios.create({
    baseURL: API_BASE_URL

})