const fetchData = () => {
    fetch("https://icanhazdadjoke.com/slack")
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
}