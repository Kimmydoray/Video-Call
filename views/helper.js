const helpers = {
    getToken : (tokenName) => {
        let cookieValue  = ""
        if(document.cookie){         
            var myCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(tokenName));
           
            if(myCookie === undefined){
                console.info('No Cookie for - ' + tokenName)
            }else{
                let testCookie =  myCookie.split('=');
                if(testCookie.length >= 2){
                    cookieValue = testCookie[1]
                }
            }
            return cookieValue
        }
        else
        {
            return ''
        }
    }
}

export default helpers