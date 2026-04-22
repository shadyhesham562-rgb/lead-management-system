import { useState } from "react"

function App() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !phone || !service) {
      alert("Please fill all fields")
      return
    }

    alert("Lead submitted successfully")

    setName("")
    setPhone("")
    setService("")
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Get More Leads for Your Business</h1>
      <p>We help businesses generate high-quality leads through smart marketing campaigns.</p>

      <button style={{ padding: "12px 20px", marginTop: "20px", marginBottom: "30px" }}>
        Contact Us on WhatsApp
      </button>

      <h2>Request a Free Consultation</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        />

        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
        >
          <option value="">Select Service</option>
          <option value="Meta Ads">Meta Ads</option>
          <option value="Google Ads">Google Ads</option>
          <option value="Web Design">Web Design</option>
          <option value="SEO">SEO</option>
        </select>

        <button type="submit" style={{ padding: "12px 20px" }}>
          Submit
        </button>
      </form>
    </div>
  )
}

export default App