'use client';
import dynamic from 'next/dynamic';
import yaml from 'yaml';
import { useEffect, useState } from 'react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
    const [spec, setSpec] = useState(null);

    useEffect(() => {
        fetch('/api-docs.yaml')
            .then((res) => res.text())
            .then((text) => setSpec(yaml.parse(text)))
            .catch((err) => console.error('Error parsing swagger yaml', err));
    }, []);

    if (!spec) return <div style={{ padding: '2rem' }}>Loading API docs...</div>;

    return (
        <div style={{ padding: '2rem', height: '100vh', backgroundColor: 'white' }}>
            <SwaggerUI spec={spec} />
            <style jsx global>{`
        body { margin: 0; background: white; }
      `}</style>
        </div>
    );
}
