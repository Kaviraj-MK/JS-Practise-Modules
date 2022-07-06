fetch('/api/data').then((result) => {
    result.json().then((result) => {
        console.log(result);
    })
    //console.log(result.json());
});


fetch('/api/studentInfo').then((result) => {
    result.json().then((result) => {
        console.log(result);
    });
});