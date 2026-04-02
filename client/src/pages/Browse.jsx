import { useState, useEffect } from 'react';
import FreelancerCard from '../components/FreelancerCard';

function Browse() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skills: '', minExp: '', maxRate: '', availability: ''
  });

  const fetchFreelancers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.skills) params.append('skills', filters.skills);
      if (filters.minExp) params.append('minExp', filters.minExp);
      if (filters.maxRate) params.append('maxRate', filters.maxRate);
      if (filters.availability) params.append('availability', filters.availability);

      const res = await fetch(`http://localhost:5000/api/freelancers?${params}`);
      const data = await res.json();
      setFreelancers(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchFreelancers(); }, []);

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchFreelancers();
  };

  const handleReset = () => {
    setFilters({ skills: '', minExp: '', maxRate: '', availability: '' });
    setTimeout(fetchFreelancers, 100);
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-2">Browse Freelancers</h2>
      <p className="text-muted mb-4">Find the perfect freelancer for your project</p>

      {/* Filter Bar */}
      <div className="card border-0 shadow-sm mb-4 p-4" style={{ borderRadius: '12px' }}>
        <form onSubmit={handleSearch}>
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label small fw-bold">Skills</label>
              <input type="text" className="form-control" name="skills"
                placeholder="e.g. React, Node.js" value={filters.skills} onChange={handleFilterChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-bold">Min Experience (yrs)</label>
              <input type="number" className="form-control" name="minExp"
                placeholder="e.g. 2" value={filters.minExp} onChange={handleFilterChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-bold">Max Rate ($/hr)</label>
              <input type="number" className="form-control" name="maxRate"
                placeholder="e.g. 50" value={filters.maxRate} onChange={handleFilterChange} />
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-bold">Availability</label>
              <select className="form-select" name="availability" value={filters.availability} onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="part-time">Part Time</option>
              </select>
            </div>
            <div className="col-md-3 d-flex gap-2">
              <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#0f3460' }}>Search</button>
              <button type="button" className="btn btn-outline-secondary w-100" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: '#0f3460' }}></div>
        </div>
      ) : freelancers.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <h5>No freelancers found</h5>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <p className="text-muted mb-3">{freelancers.length} freelancer(s) found</p>
          <div className="row g-4">
            {freelancers.map(f => (
              <div key={f._id} className="col-md-4">
                <FreelancerCard freelancer={f} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Browse;