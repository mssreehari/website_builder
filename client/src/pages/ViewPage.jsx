import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ViewPage() {
  const { id } = useParams();
  const [page, setPage] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/pages/${id}`).then(res => setPage(res.data));
  }, [id]);

  if (!page) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{page.title}</h1>
      <div className="mt-4 space-y-2">
        {page.layout.map((comp, i) => {
          if (comp.type === 'header') return <h2 key={i}>{comp.content}</h2>;
          if (comp.type === 'text') return <p key={i}>{comp.content}</p>;
          if (comp.type === 'image') return <img key={i} src={comp.src} alt="" />;
        })}
      </div>
    </div>
  );
}
