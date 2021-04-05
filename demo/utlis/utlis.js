
const loadGLSL = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(res => res.text())
        .then((text) => resolve(text))
        .catch((e) => { 
            reject(e);
            throw new Error(e);
        })
    })
}