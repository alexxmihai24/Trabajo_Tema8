'use client';
import { useEffect } from 'react';

export default function ApiDocs() {
    useEffect(() => {
        // Dynamically load swagger-ui-dist to avoid SSR issues
        const loadSwagger = async () => {
            const SwaggerUIBundle = (await import('swagger-ui-dist/swagger-ui-bundle.js')).default;
            await import('swagger-ui-dist/swagger-ui.css');

            SwaggerUIBundle({
                url: '/api-docs.yaml',
                dom_id: '#swagger-ui',
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIBundle.SwaggerUIStandalonePreset,
                ],
                layout: 'BaseLayout',
                deepLinking: true,
            });
        };

        loadSwagger();
    }, []);

    return (
        <>
            <div id="swagger-ui" />
        </>
    );
}
