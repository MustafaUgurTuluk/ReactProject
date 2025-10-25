import { useState, useEffect } from "react";

const AramaCubugu = ({ aramaMetni, setAramaMetni }) => (
  <input
    type="text"
    placeholder="Başlık veya yazar ara..."
    value={aramaMetni}
    onChange={e => setAramaMetni(e.target.value)}
    style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
  />
);

function App() {
  const kitaplar = [
    { id: 1, baslik: "React’e Giriş", yazar: "D. Usta", kategori: "Web" },
    { id: 2, baslik: "İleri JavaScript", yazar: "S. Kılıç", kategori: "Web" },
    { id: 3, baslik: "Veri Yapıları", yazar: "A. Demir", kategori: "CS" },
    { id: 4, baslik: "Algoritmalar", yazar: "E. Kaya", kategori: "CS" },
    { id: 5, baslik: "UI/UX Temelleri", yazar: "N. Akın", kategori: "Tasarım" },
  ];

  const [aramaMetni, setAramaMetni] = useState(localStorage.getItem("aramaMetni") || "");
  const [kategori, setKategori] = useState("Tümü");
  const [favoriler, setFavoriler] = useState(JSON.parse(localStorage.getItem("favoriler")) || []);

  useEffect(() => {
    localStorage.setItem("aramaMetni", aramaMetni);
    localStorage.setItem("favoriler", JSON.stringify(favoriler));
  }, [aramaMetni, favoriler]);

  const filtrelenmis = kitaplar.filter(k => {
    const arama = aramaMetni.toLowerCase();
    const baslikUygun = k.baslik.toLowerCase().includes(arama) || k.yazar.toLowerCase().includes(arama);
    const kategoriUygun = kategori === "Tümü" || k.kategori === kategori;
    return baslikUygun && kategoriUygun;
  });

  const toggleFavori = (id) => {
    setFavoriler(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const KategoriFiltre = () => {
    const kategoriler = ["Tümü", "Web", "CS", "Tasarım"];
    return (
      <select value={kategori} onChange={e => setKategori(e.target.value)}
        style={{ padding: "8px", marginBottom: "20px", borderRadius: "5px", border: "1px solid #ccc" }}>
        {kategoriler.map(k => <option key={k}>{k}</option>)}
      </select>
    );
  };

  const KitapKarti = ({ id, baslik, yazar, kategori }) => (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: "10px",
      marginBottom: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div>
        <h4 style={{ margin: "0 0 5px 0" }}>{baslik}</h4>
        <p style={{ margin: 0 }}>{yazar} — {kategori}</p>
      </div>
      <button onClick={() => toggleFavori(id)}
        style={{
          background: favoriler.includes(id) ? "#911d23ff" : "#7b9679ff",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "5px 10px",
          cursor: "pointer"
        }}>
        {favoriler.includes(id) ? "Favoride" : "Favori Ekle"}
      </button>
    </div>
  );

  const KitapListe = () => (
    <div style={{ flex: 2 }}>
      {filtrelenmis.length === 0 ? <p>Hiç kitap bulunamadı</p> :
        filtrelenmis.map(k => <KitapKarti key={k.id} {...k} />)
      }
    </div>
  );

  const FavoriPaneli = () => {
    const favoriKitaplar = kitaplar.filter(k => favoriler.includes(k.id));
    return (
      <div style={{
        flex: 1,
        marginLeft: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        height: "fit-content"
      }}>
        <h3>Favoriler ({favoriKitaplar.length})</h3>
        {favoriKitaplar.length === 0 ? <p>Henüz favori yok.</p> :
          <ul style={{ listStyle: "none", padding: 0 }}>
            {favoriKitaplar.map(k => (
              <li key={k.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                {k.baslik}
                <button onClick={() => toggleFavori(k.id)}
                  style={{ background: "#ccc", border: "1px solid #ccc", borderRadius: "4px", padding: "2px 5px" }}>
                  Kaldır
                </button>
              </li>
            ))}
          </ul>
        }
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Mini Kitaplık</h1>
      <AramaCubugu aramaMetni={aramaMetni} setAramaMetni={setAramaMetni} />
      <KategoriFiltre />
      <div style={{ display: "flex", gap: "20px" }}>
        <KitapListe />
        <FavoriPaneli />
      </div>
    </div>
  );
}

export default App;
