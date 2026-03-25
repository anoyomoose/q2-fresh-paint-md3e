import{K as e,P as t,bt as n,c as r,d as i,g as a,q as o}from"./runtime-core.esm-bundler-CI8Widki.js";import"./Platform-AG5ZHNIu.js";import"./event-7OojjrsS.js";import{t as s}from"./set-css-var-U_oxsZQW.js";import"./History-qSfngmbk.js";import"./nodes-BsCeQ2LV.js";import"./QIcon-BFRXBkFH.js";import"./QSpinner-BsXfJneE.js";import"./Ripple-DFGdxGN_.js";import"./use-align-CIuCMqUK.js";import"./use-router-link-CLLSGXob.js";import{t as c}from"./QBtn-BSWyx-9a.js";import"./uid-I6RSMId3.js";import"./selection-DX76_aOf.js";import"./use-portal-Cn25mxg_.js";import"./scroll-CeDBKYx0.js";import"./escape-key-BhCb-QB9.js";import"./focusout-XgjfWK7A.js";import"./use-prevent-scroll-D2fofH5e.js";import"./prevent-scroll-CpBHeN_t.js";import{t as l}from"./QDialog-BsLilsuH.js";import"./rtl-bWMlO5Bg.js";import{t as u}from"./QCard-CMxUTTw0.js";import{t as d}from"./QSeparator-DTiuIdLR.js";import{m as f,u as p}from"./index-C_11vzBQ.js";import"./use-hydration-BrUtlgHq.js";import"./QResizeObserver-Bn3_tBBE.js";import{t as m}from"./QTabs-DyQG3I8e.js";import"./touch-BS2ICJyE.js";import{t as h}from"./ClosePopup-Bg9CzFOU.js";import"./use-tab-BYYKkSe8.js";import{t as g}from"./QTab-c-OCSWTV.js";import"./use-panel-D4OnPW8F.js";import{t as _}from"./QTabPanel-DXCYNntO.js";import{t as v}from"./QTabPanels-olrk2I32.js";import{t as y}from"./colors-C-aiDZ-b.js";var{luminosity:b}=y,x={data(){return{colors:{primary:`#027BE3`,secondary:`#26A69A`,accent:`#9C27B0`,dark:`#1d1d1d`,positive:`#21BA45`,negative:`#C10015`,info:`#31CCEC`,warning:`#F2C037`},dark:{primary:!0,secondary:!0,accent:!0,dark:!0,positive:!0,negative:!0,info:!1,warning:!1},darkMode:!1,exportDialog:!1,exportTab:`sass`,list:[`primary`,`secondary`,`accent`,`dark`,`positive`,`negative`,`info`,`warning`],sideColors:[`secondary`,`dark`,`positive`,`negative`,`info`,`warning`]}},watch:{"colors.primary"(e){this.update(`primary`,e)},"colors.secondary"(e){this.update(`secondary`,e)},"colors.accent"(e){this.update(`accent`,e)},"colors.dark"(e){this.update(`dark`,e)},"colors.positive"(e){this.update(`positive`,e)},"colors.negative"(e){this.update(`negative`,e)},"colors.info"(e){this.update(`info`,e)},"colors.warning"(e){this.update(`warning`,e)}},computed:{pageClass(){return this.darkMode===!0?`bg-grey-10 text-white`:`bg-white text-black`},sassExport(){return`// src/css/quasar.variables.sass

$primary   : ${this.colors.primary}\n$secondary : ${this.colors.secondary}\n$accent    : ${this.colors.accent}\n\n$dark      : ${this.colors.dark}\n\n$positive  : ${this.colors.positive}\n$negative  : ${this.colors.negative}\n$info      : ${this.colors.info}\n$warning   : ${this.colors.warning}`},scssExport(){return`// src/css/quasar.variables.scss

$primary   : ${this.colors.primary};\n$secondary : ${this.colors.secondary};\n$accent    : ${this.colors.accent};\n\n$dark      : ${this.colors.dark};\n\n$positive  : ${this.colors.positive};\n$negative  : ${this.colors.negative};\n$info      : ${this.colors.info};\n$warning   : ${this.colors.warning};`},quasarCliExport(){return`// quasar.conf.js

return {
  framework: {
    config: {
      brand: {
        primary: '${this.colors.primary}',
        secondary: '${this.colors.secondary}',
        accent: '${this.colors.accent}',

        dark: '${this.colors.dark}',

        positive: '${this.colors.positive}',
        negative: '${this.colors.negative}',
        info: '${this.colors.info}',
        warning: '${this.colors.warning}'
      }
    }
  }
}`},umdExport(){return`app.use(Quasar, {
  config: {
    brand: {
      primary: '${this.colors.primary}',
      secondary: '${this.colors.secondary}',
      accent: '${this.colors.accent}',

      dark: '${this.colors.dark}',

      positive: '${this.colors.positive}',
      negative: '${this.colors.negative}',
      info: '${this.colors.info}',
      warning: '${this.colors.warning}'
    }
  }
}`},vueCliExport(){return`// main.js

app.use(Quasar, {
  config: {
    brand: {
      primary: '${this.colors.primary}',
      secondary: '${this.colors.secondary}',
      accent: '${this.colors.accent}',

      dark: '${this.colors.dark}',

      positive: '${this.colors.positive}',
      negative: '${this.colors.negative}',
      info: '${this.colors.info}',
      warning: '${this.colors.warning}'
    }
  }
})`}},methods:{update(e,t){s(e,t,document.getElementById(`theme-picker`)),this.dark[e]=b(t)<=.4}}},S={class:`q-layout-padding`};function C(s,f,y,b,x,C){return t(),i(`div`,S,[a(c,{color:`primary`,label:`Export`,onClick:f[0]||=e=>x.exportDialog=!0}),a(l,{modelValue:x.exportDialog,"onUpdate:modelValue":f[3]||=e=>x.exportDialog=e},{default:e(()=>[a(u,null,{default:e(()=>[a(m,{class:`text-grey-7`,modelValue:x.exportTab,"onUpdate:modelValue":f[1]||=e=>x.exportTab=e,"active-color":`primary`,align:`justify`},{default:e(()=>[a(g,{name:`sass`,"no-caps":``,label:`Sass`}),a(g,{name:`scss`,"no-caps":``,label:`SCSS`}),a(g,{name:`quasar-cli`,"no-caps":``,label:`Quasar CLI`}),a(g,{name:`umd`,"no-caps":``,label:`UMD`}),a(g,{name:`vue-cli`,"no-caps":``,label:`Vue CLI`})]),_:1},8,[`modelValue`]),a(d),a(v,{class:`bg-code`,modelValue:x.exportTab,"onUpdate:modelValue":f[2]||=e=>x.exportTab=e,animated:``},{default:e(()=>[a(_,{class:`q-pa-none`,name:`sass`},{default:e(()=>[r(`pre`,null,n(C.sassExport),1)]),_:1}),a(_,{class:`q-pa-none`,name:`scss`},{default:e(()=>[r(`pre`,null,n(C.scssExport),1)]),_:1}),a(_,{class:`q-pa-none`,name:`quasar-cli`},{default:e(()=>[r(`pre`,null,n(C.quasarCliExport),1)]),_:1}),a(_,{class:`q-pa-none`,name:`umd`},{default:e(()=>[r(`pre`,null,n(C.umdExport),1)]),_:1}),a(_,{class:`q-pa-none`,name:`vue-cli`},{default:e(()=>[r(`pre`,null,n(C.vueCliExport),1)]),_:1})]),_:1},8,[`modelValue`]),a(d),a(p,{align:`right`},{default:e(()=>[o(a(c,{color:`primary`,flat:``,label:`Close`},null,512),[[h]])]),_:1})]),_:1})]),_:1},8,[`modelValue`])])}var w=f(x,[[`render`,C]]);export{w as default};