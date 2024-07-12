module.exports = (query) => {
    let objextSearch = {
        keyword: ""
    }

    if(query.keyword) {
        objextSearch.keyword = query.keyword;

        const regex = new RegExp(objextSearch.keyword, "i");
        objextSearch.regex = regex;
    }
    return objextSearch
}