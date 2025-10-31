let timeout = 0

export function tokenTimeout(time: number, callback: () => void = () => null) {
    timeout = setTimeout(() => {
        callback()
        cookieStore.delete("session")
    }, time*1000);
    return timeout
}

export function clearTokenTimeout(){
    clearTimeout(timeout)
}