const $ = (id) => document.getElementById(id);



const person = {
    name: ['John', 'Doe'],
    age:27,
    occupation: "Software Developer",
    bio: function(){
        return `${this.name[0]} ${this.name[1]} is a ${this.age} year old ${this.occupation}.`;
    }
}

$('btnSticker').addEventListener('click', function(){
    $('output').innerText = person.bio();
});

$('txtUserInput').addEventListener('change', function(e){
    const newName = e.target.value.split("");
    person.name = newName;
document.getElementById('output').innerText = person.bio();
});

