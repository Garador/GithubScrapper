export enum SEARCH_TYPES {
    code = "Code",
    commits = "Commits"
    ,issues = "Issues"
}

export enum DEF_NEXT_PAGE_QSELECTOR {
    code = "div > a.next_page"
    ,commits = "div > a.next_page"
    ,issues = "div > a.next_page"
}

export enum DEF_ELEMENT_QS {    //Selectors for the item elements
    code = "#code_search_results > div.code-list > div"
    ,commit_elements = "#commit_search_results > div"
    ,commit_title = ".commit-title"
    ,commit_description = ".commit-desc"
    ,issue_elements = ".issue-list-item"
    ,issue_title = ".text-normal"
    ,issue_description = "div > p"
}

export enum SEARCH_ORDER {
    asc = "asc",
    desc = "desc"
}