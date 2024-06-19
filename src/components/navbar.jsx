import { Link } from 'react-router-dom'
import styles from'./navbar.module.css'
const navbar = () => {
  return (
    <>
    <nav >
          <div className={styles.nav_container}>
            <Link to="/" className="nav_brand">
              <img src="logo.svg" className="nav_logo" />
            </Link>

            <div >
              <ul className={styles.nav_itemwrapper}>
                <li className={styles.nav_item}>
                  <Link className={styles.nav_link} to="/">Home</Link>
                </li>
                <li className={styles.nav_item}>
                  <Link className={styles.nav_link} to="/pricing">Pricing</Link>
                </li>
            
              </ul>
            </div>

            <div>
            <button>ss</button>
            </div>

          </div>
        </nav>
    </>
  )
}

export default navbar