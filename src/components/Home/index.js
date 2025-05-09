import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-container">
      <div className="home-content">
        <h1 className="heading">Find The Job That Fits Your Life</h1>
        <p className="para">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the jobs that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" className="shop-now-button">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </>
)
export default Home
