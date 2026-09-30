import chef from '../assets/chef-claude-icon.png'

export default function Header() {
    return (
        <article className='header'>
            <img src={chef} alt='chefIcon'></img>
            <h3>Chefouille</h3>
        </article>
    )
}