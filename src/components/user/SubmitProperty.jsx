export default function SubmitProperty({ form, setForm, onSubmit, errors = {}, submitting = false }) {
  const upd = key => event => setForm(prev => ({ ...prev, [key]: event.target.value }));

  const handleImageFile = file => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = event => setForm(prev => ({ ...prev, image: file, imagePreview: event.target.result }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sc" style={{ maxWidth: 650 }}>
      <div className="sc-head">
        <div>
          <div className="sc-title">Submit Your Property</div>
          <div className="sc-desc">Get a personalised enhancement report for your home</div>
        </div>
      </div>

      <div className="fgrid">
        <div className="fg">
          <label className="flabel">Your Name</label>
          <input className="finput" value={form.name} readOnly />
        </div>
        <div className="fg">
          <label className="flabel">City / Location *</label>
          <input className="finput" placeholder="e.g. Pune, Maharashtra" value={form.location} onChange={upd("location")} />
          {errors.location && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.location}</div>}
        </div>
        <div className="fg">
          <label className="flabel">Property Type *</label>
          <select className="finput" value={form.type} onChange={upd("type")}>
            <option value="">Select type</option>
            <option>1BHK</option><option>2BHK</option><option>3BHK</option><option>Villa</option><option>Row House</option>
          </select>
          {errors.type && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.type}</div>}
        </div>
        <div className="fg">
          <label className="flabel">Built-up Area (sqft) *</label>
          <input className="finput" placeholder="e.g. 950" value={form.area} onChange={upd("area")} />
          {errors.area && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.area}</div>}
        </div>
        <div className="fg">
          <label className="flabel">Improvement Budget *</label>
          <input className="finput" placeholder="e.g. Rs 75,000 or Rs 1.5 Lakhs" value={form.budget} onChange={upd("budget")} />
          {errors.budget && <div style={{ color: "#ef4444", fontSize: 12, marginTop: 6 }}>{errors.budget}</div>}
        </div>
        <div className="fg">
          <label className="flabel">Property Age</label>
          <select className="finput" value={form.age} onChange={upd("age")}>
            <option value="">Select</option>
            <option>Under 5 yrs</option><option>5-10 yrs</option><option>10-20 yrs</option><option>20+ yrs</option>
          </select>
        </div>
        <div className="fg full">
          <label className="flabel">Key Concerns / Goals</label>
          <textarea className="finput" rows={3} placeholder="e.g. Damp walls in kitchen, want better resale value..." value={form.concerns} onChange={upd("concerns")} />
        </div>
        <div className="fg full">
          <label className="flabel">Property Image</label>
          <div
            style={{
              border: form.imagePreview ? "2px solid var(--brand)" : "2px dashed var(--border)",
              borderRadius: 10,
              padding: "18px 14px",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
            onClick={() => document.getElementById("prop-img-input").click()}
            onDragOver={event => event.preventDefault()}
            onDrop={event => { event.preventDefault(); handleImageFile(event.dataTransfer.files[0]); }}
          >
            <input id="prop-img-input" type="file" accept="image/*" style={{ display: "none" }} onChange={event => handleImageFile(event.target.files[0])} />
            {form.imagePreview ? (
              <div style={{ width: "100%", position: "relative" }}>
                <img src={form.imagePreview} alt="Property preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 8, display: "block" }} />
                <button
                  style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}
                  onClick={event => { event.stopPropagation(); setForm(prev => ({ ...prev, image: null, imagePreview: null })); }}
                >
                  X Remove
                </button>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 36 }}>IMG</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--charcoal)" }}>Upload Property Photo</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Click to browse or drag and drop. JPG, PNG, WEBP.</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <button className="btn-p" onClick={onSubmit} disabled={submitting}>{submitting ? "Submitting..." : "Submit for Analysis"}</button>
        <button className="btn-g" onClick={() => setForm(prev => ({ ...prev, location: "", type: "", area: "", budget: "", age: "", concerns: "", image: null, imagePreview: null }))}>Clear</button>
      </div>
    </div>
  );
}
