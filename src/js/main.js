const statusEl = document.getElementById("status");
const dataEl = document.getElementById("data");
const headersEl = document.getElementById("headers");
const configEl = document.getElementById("config");

// axios.interceptors.request.use(
//   function (config) {
//     config.headers.common.tokenNew = "tokenNew";
//     config.data = {
//       meu_nome: "João Vitor",
//     };
//     console.log(config);
//     return config;
//   },
//   function (error) {
//     console.log(error);
//     return Promise.reject(error);
//   }
// );

const newAxios = axios.create({
  baseURL: "https://api.example.com",
});

newAxios.defaults.headers.common["Authorization"] = "New Axios";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.response.use(
  function (response) {
    // Status 200
    console.log("interceptors: ", response);
    return response;
  },
  function (error) {
    // Status != 200
    console.log("interceptors Error: ", error.response);

    return Promise.reject(error);
  }
);

const get = () => {
  axios
    // newAxios
    // .get("https://jsonplaceholder.typicode.com/posts", {
    .get("/posts", {
      params: {
        _limit: 5,
      },
    })
    .then((response) => {
      renderOutput(response);
    });
};

const post = () => {
  const data = {
    title: "teste",
    body: "bar",
    userId: 1,
  };
  axios
    .post("https://jsonplaceholder.typicode.com/posts", data)
    .then((response) => {
      renderOutput(response);
    });

  console.log("post");
};

const put = () => {
  const data = {
    title: "teste1",
    // body: "bar1",
    userId: 1,
  };
  axios
    .put("https://jsonplaceholder.typicode.com/posts/1", data)
    .then((response) => {
      renderOutput(response);
    });

  console.log("put");
};

const patch = () => {
  const data = {
    title: "teste12",
    body: "bar12",
    userId: 1,
  };
  axios
    .patch("https://jsonplaceholder.typicode.com/posts/1", data)
    .then((response) => {
      renderOutput(response);
    });

  console.log("patch");
};

const del = () => {
  axios.put("https://jsonplaceholder.typicode.com/posts/2").then((response) => {
    renderOutput(response);
  });
  console.log("delete");
};

const multiple = () => {
  Promise.all([
    axios.get("https://jsonplaceholder.typicode.com/posts"),
    axios.get("https://jsonplaceholder.typicode.com/users"),
  ]).then((response) => {
    console.log(response[0]);
    console.log(response[1]);
  });

  console.log("multiple");
};

const transform = () => {
  const config = {
    params: {
      _limit: 5,
    },
    transformResponse: [
      function (data) {
        const payload = JSON.parse(data).map((o) => {
          return {
            ...o,
            is_selected: false,
            first_name: "Nome",
          };
        });
        return payload;
      },
    ],
  };
  axios
    .get("https://jsonplaceholder.typicode.com/posts", config)
    .then((response) => {
      renderOutput(response);
    });

  console.log("transform");
};

const errorHandling = () => {
  axios
    .get("https://jsonplaceholder.typicode.com/postsz")
    .then((response) => {
      renderOutput(response);
    })
    .catch((error) => {
      renderOutput(error.response);
      console.log(error.response);
    });
  console.log("errorHandling");
};

const cancel = () => {
  const controller = new AbortController();
  const config = {
    params: {
      _limit: 5,
    },
    signal: controller.signal,
  };
  axios
    .get("https://jsonplaceholder.typicode.com/posts", config)
    .then((response) => {
      renderOutput(response);
    })
    .catch((e) => {
      console.log(e.message);
      console.log(e);
    });
  controller.abort();
  console.log("cancel");
};

const clear = () => {
  statusEl.innerHTML = "";
  statusEl.className = "";
  dataEl.innerHTML = "";
  headersEl.innerHTML = "";
  configEl.innerHTML = "";
};

const renderOutput = (response) => {
  // Status
  const status = response.status;
  statusEl.removeAttribute("class");
  let statusElClass =
    "inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium";
  if (status >= 500) {
    statusElClass += " bg-red-100 text-red-800";
  } else if (status >= 400) {
    statusElClass += " bg-yellow-100 text-yellow-800";
  } else if (status >= 200) {
    statusElClass += " bg-green-100 text-green-800";
  }

  statusEl.innerHTML = status;
  statusEl.className = statusElClass;

  // Data
  dataEl.innerHTML = JSON.stringify(response.data, null, 2);
  Prism.highlightElement(dataEl);

  // Headers
  headersEl.innerHTML = JSON.stringify(response.headers, null, 2);
  Prism.highlightElement(headersEl);

  // Config
  configEl.innerHTML = JSON.stringify(response.config, null, 2);
  Prism.highlightElement(configEl);
};

document.getElementById("get").addEventListener("click", get);
document.getElementById("post").addEventListener("click", post);
document.getElementById("put").addEventListener("click", put);
document.getElementById("patch").addEventListener("click", patch);
document.getElementById("delete").addEventListener("click", del);
document.getElementById("multiple").addEventListener("click", multiple);
document.getElementById("transform").addEventListener("click", transform);
document.getElementById("cancel").addEventListener("click", cancel);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("clear").addEventListener("click", clear);
