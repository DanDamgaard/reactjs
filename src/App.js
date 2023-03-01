import { createElement } from 'react';
import './App.css';


function App() {
  
  // init url
  const API_url = "https://the-trivia-api.com/api/questions";
  // init svar arrays
  var answers;
  var qarray;

  // vis quiz valgmuliheder
  function showOptions(){
    var btn = document.getElementById("Btn");
    btn.style.display = "None";
    var quizOptions = document.getElementById("quizOptions");
    quizOptions.style.display = "block";
  }

  // Nulstil quiz valgmuligheder 
  function resetOptions(){
    var quizDisplay = document.getElementById("quizDisplay");
    quizDisplay.innerHTML = "";
    quizDisplay.style.display = "none";

    document.getElementById('category').value="arts_and_literature";
    document.getElementById('difficulty').value="easy";
    document.getElementById('limit').value="1";
  }
  
  // lav spørgsmål til quiz
  async function Makequestion(){
    qarray = [];
    // lav ui til quiz valgmuligheder
    var catValue = document.getElementById("category").value;
    var difValue = document.getElementById("difficulty").value;
    var limValue = document.getElementById("limit").value;

    var API_call = API_url + "?categories=" + catValue + "&limit=" + limValue + "&region=DK" + "&difficulty=" + difValue;
    let response = await fetch(API_call)
    let data = await response.json();
    console.log(data);

    // lav spørgsmål til quiz og gem dem i array
    for(let i = 0; i < data.length; i++){
      var correctAnswer = data[i].correctAnswer;
      var question = data[i].question;
      var wrongArray = data[i].incorrectAnswers;
      
      var questionArray = [question, correctAnswer, wrongArray[0],wrongArray[1],wrongArray[2]];
      qarray.push(questionArray);
    }

    // vis quiz
    display(qarray);

  }

  // bland svar
  function shuffle(array) {
    var sArray = array;
    for (let i = sArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [sArray[i], sArray[j]] = [sArray[j], sArray[i]];
    }
    return sArray;
  }

  // vælge svar når man trykker på svar
  function quizInput(btn, number, ul){
    var UL = document.getElementById(ul);
    var items = UL.getElementsByTagName("li");

    for(var i = 0; i < items.length; i++){
      if(items[i] != btn){
        items[i].classList = "quizBtn";
      }
      
    }

    btn.classList= "quizBtnSelect";
    let str = btn.innerText.substring(3);
    answers[number] = str;
  }

  // tjek om der er blevet svaret på alle spørgsmål
  function answeredAll(){
    var value = true;
    if(answers.length == 0){ value = false}
    
    if(value == true){
      for(let i = 0; i < answers.length; i++){
        if(answers[i] == null || answers[i] == 0){ 
          value = false;
          break;
        }
      }
    }

    return value;
  }

  // få resultat på quiz
  function submitQuiz(){
    
    if(answeredAll() === true){
      var answersdiv = document.getElementById("quizDisplay");
      answersdiv.innerHTML = "";
      
      var button = document.createElement("button");
      button.innerText = "Prøv igen?"
      button.classList = "submitBtn";
      button.onclick = function () { 
        resetOptions();
        showOptions(); 
      };
      for(let i = 0; i<answers.length; i++){
        var question = qarray[i];

        var div = document.createElement("div");
        var divAnswer = document.createElement("div");
        divAnswer.setAttribute("id","answer");
        divAnswer.innerText = "Svaret er: " + question[1];
        var questionLabel = document.createElement("label");
        var color = "green";
        if(answers[i] !== question[1]){ color = "red";}
        questionLabel.style.color = color;
        questionLabel.style.textDecoration = "underline"
        
        questionLabel.innerHTML =  (i+1) + ". " + question[0];
        div.appendChild(questionLabel);
        div.appendChild(divAnswer);

        answersdiv.appendChild(div);
      }
      answersdiv.appendChild(button);
    }else{
      alert("Du har ikke svaret på alle spørgsmål!!!")
    }
    
  }

  // lav quiz
  function display(Array){
    answers = [];

    var quizOptions = document.getElementById("quizOptions");
    quizOptions.style.display = "none";
    var divBody = document.getElementById("quizDisplay");
    divBody.innerHTML = "";
    var submitBtn = document.createElement("button");
    submitBtn.innerText = "Indsend svar";
    submitBtn.classList = "submitBtn";
    submitBtn.onclick = submitQuiz;
    // lav horizontal lister med spørgsmål og svar 
    for(let i = 0; i < Array.length; i++){
      let qarray = Array[i];
      let questionArray = shuffle([qarray[1], qarray[2],qarray[3],qarray[4]]);
      var newDiv = document.createElement('div');
      var label = document.createElement('label');
      label.style.color = "green";
      label.style.textDecoration = "underline"

      label.innerHTML =  (i+1) + ". " + qarray[0];
      newDiv.appendChild(label)
      var ulDiv = document.createElement('div');
      var UL = document.createElement("ul")
      UL.setAttribute("id", "UL" + i);
      // lav svar til spørgsmål
      for(let int = 0; int < questionArray.length; int++){
        var LI = document.createElement("li");
        LI.className = "quizBtn";
        LI.setAttribute("id", int);
        LI.innerText = (int + 1) + ". " + questionArray[int]
        LI.onclick = function () { 
          quizInput(this, i, "UL" + i); 
        };
        UL.appendChild(LI);
      }

      ulDiv.appendChild(UL);
      newDiv.appendChild(ulDiv);
      newDiv.appendChild(submitBtn);

      divBody.appendChild(newDiv);
    }
    
    divBody.style.display = "block"

  }

  return (
    <div className="App">
      <header className="App-header">
        <button id='Btn' onClick={showOptions}><h1>Lav Quiz</h1></button>

         <div id='quizOptions' style={{display: "none"}}>
          <div>
            <label style={{color:"black"}}>Kategori</label>
              <div>
                <select id="category">
                  <option value="arts_and_literature">Kunst og litteratur</option>
                  <option value="film_and_tv">Film og TV</option>
                  <option value="food_and_drink">Mad og drikke</option>
                  <option value="general_knowledge">Almen viden</option>
                  <option value="geography">Geografi</option>
                  <option value="history">Historie</option>
                  <option value="music">Musik</option>
                  <option value="science">Videnskab</option>
                  <option value="society_and_culture">Samfund og kultur</option>
                  <option value="sport_and_leisure">Sport og fritid</option>
                </select>
              </div>
              <label style={{color:"black"}}>Sværhedsgrad</label>
              <div>
                <select id="difficulty">
                  <option value="easy">Let</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Svært</option>
                </select>
              </div>
              <label style={{color:"black", margin: "0% 20%"}}>Antal</label>
              <div>
                <select id="limit">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
              </div>

              <button className='submitBtn' onClick={Makequestion}>Start quiz</button>
          </div>
        </div>

        <div id='quizDisplay' style={{display: "none"}}></div>
        
      </header>

      

    </div>
  );
}

export default App;
