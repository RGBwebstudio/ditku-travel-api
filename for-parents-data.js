/* Потрібно реалізувати модуль "Конструктор сторінок" page-constructor, структура сутності лежить в constructor_page, в опис полів додана логіка для реалізації, реалізуй також ще одну точку доступу до стандартних CRUD - вибірку записів за переданим хедером мови (вже реалізовано в api), тобто мають повертатись лише ті що співпадають із записом lang, додай також swagger документації за прикладом реалізованих модулів */

const constructor_page = {
  lang: "тут має бути enum мови який вже визначений в api",
  structure: "тут буде лежати json структура в залежності від вибраного type + до кожного об'єкту буде ще поле order: number",
  type: "тут має бути enum TypeLabels",
}

const data = {
  text_block: {
    title: "",
    text: ""
  },
  plates: {
    title: "",
    text: "",
    pink_title: "",
    pink_text: "",
    orange_title: "",
    orange_text: "",
    image: "",
    yellow_title: "",
    yellow_text: "",
    image_tall: "",
    yellow_title_2: "",
    yellow_text_2: "",
    pink_title_2: "",
    pink_text_2: ""
  },
  blog_list: {
    title: "",
    posts: [{
      id: 0,
      order: 0,
    }]
  },
  ready: {
    image_1: "",
    image_2: "",
    image_3: "",
    image_4: "",
    image_5: "",
    title: "",
    text: "",
    button_text: "",
  },
  testimonials: [
    {
      title: "",
      text: ""
    }
  ],
  form: {
    title: "",
    text: "",
  },
  in_numbers: {
    title: "",
    image: "",
    yellow_title: "",
    yellow_text: "",
    pink_title: "",
    pink_text: "",
    pink_2_title: "",
    pink_2_text: "",
    orange_title: "",
    orange_text: "",
  },
  planning: {
    title: "",
    text: "",
    button_text: "",
  }
}

enum TypeLabels {
  text_block = "Текстовий блок",
  plates = "Плитки",
  blog_list = "Список постів",
  ready = "Фото по колу",
  testimonials = "Відгуки",
  form = "Форма",
  in_numbers = "Плитки з фото (зліва)",
  planning = "Блок із закликом до дії"
}