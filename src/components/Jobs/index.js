import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    employeeType: [],
    minimumSalary: 0,
    searchInput: '',
  }

  componentDidMount() {
    this.getJobs()
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {employeeType, minimumSalary, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employeeType.join()}&minimum_package=${minimumSalary}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobsData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobsList: updatedJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    const renderJobsList = jobsList.length > 0

    return renderJobsList ? (
      <div className="all-jobs-container">
        <ul className="jobs-list">
          {jobsList.map(job => (
            <JobCard jobData={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          className="no-jobs-img"
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filter.
        </p>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="jobs-error-view-constainer">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="jobs-failure-img"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page your are looking for
      </p>
      <button
        className="jobs-failure-button"
        type="button"
        data-testid="button"
        onClick={this.getJobs}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#fffff" heigth="50" width="50" />
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  changeSalary = salary => {
    this.setState({minimumSalary: salary}, this.getJobs)
  }

  changeEmployeeList = type => {
    this.setState(
      prev => ({
        employeeType: [...prev.employeeType, type],
      }),
      this.getJobs,
    )
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-content">
            <FiltersGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeSearchInput={this.changeSearchInput}
              searchInput={searchInput}
              getjobs={this.getJobs}
              changeSalary={this.changeSalary}
              changeEmployeeList={this.changeEmployeeList}
            />
            <div className="search-input-jobs-list-container">
              <div className="search-input-container-desktop">
                <input
                  type="search"
                  className="search-input-desktop"
                  placeholder="Search"
                  onChange={this.changeSearchInput}
                  onKeyDown={this.onEnterSearchInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-button-container-desktop"
                  onClick={this.getJobs}
                >
                  <BsSearch className="search-icon-desktop" />
                </button>
              </div>
              {this.renderAllJobs()}
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
