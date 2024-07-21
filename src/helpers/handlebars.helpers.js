import { config } from "../config/variables.config.js";

const hbsHelpers = {
  times: function (n, block) {
    {
      let result = "";
      for (let i = 0; i < n; i++) {
        result += block.fn(i + 1);
      }
      return result;
    }
  },
  ifEquals: function (a, b, options) {
    if (a === b) {
      return options.fn(this);
    }

    return options.inverse(this);
  },
  ifGreater: function (a,b,options) {
    if (a > b) {
        return options.fn(this);
      }
  
    return options.inverse(this);
  },
  updateQueryParam: function (param, value, queries) {
    try {
      const url = `${config.BASE_URL}/products`;
      const urlParams = new URLSearchParams(queries);
      urlParams.set(param, value);
      return `${url}?${urlParams.toString()}`;
    } catch (error) {
      console.log(error);
    }
  },
};

export default hbsHelpers;
