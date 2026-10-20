import '../styles/header.css'
import '../styles/pomato.css'

function Header(){
return (
<div className="header">
  <div className="logo-row">
    <span className="brand-name">Pomato</span>
  </div>
  <h1>Study together, <em>grow together!</em></h1>
  <p>Pomodoro · To-Do List · Study Room — all in one. Because "pomodoro" means tomato! 🍅</p>
  <div className="header-tags">
    <span className="tag tag-red">🍅 Pomodoro = Tomato</span>
    <span className="tag tag-green">🌿 Focus · Grow</span>
    <span className="tag tag-red">❤️ Study with friends</span>
  </div>
</div>

);
}

export default Header;
