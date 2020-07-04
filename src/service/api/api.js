import service from "../http.js"
export function login_new(data){
  return service({
        method:"post",
        url:"login",
        data
    })
}

export function getUserList(params){
    return service({
        url:"users",
        params
    })
}
export function userStateChanged(url){
  return service({
    method:"put",
    url
  })
}