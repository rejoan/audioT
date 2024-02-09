import Maska from "maska";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("maska", Maska);
});
