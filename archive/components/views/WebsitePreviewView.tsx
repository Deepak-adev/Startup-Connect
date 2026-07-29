import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { WebsiteStorageService } from '../../services/websiteStorage';
import { Button } from '../ui';
import { ExternalLink, Download, Trash2, ArrowLeft } from 'lucide-react';
import type { GeneratedWebsite } from '../../services/websiteStorage';

export default function WebsitePreviewView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const websiteId = searchParams.get('websiteId');
  const [website, setWebsite] = useState<GeneratedWebsite | null>(null);

  useEffect(() => {
    if (websiteId) {
      const loaded = WebsiteStorageService.getWebsiteById(websiteId);
      setWebsite(loaded);
    }
  }, [websiteId]);

  if (!website) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">Website not found</p>
      </div>
    );
  }

  const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${website.title}</title>
  <style>${website.cssContent}</style>
</head>
<body>
  ${website.htmlContent}
  <script>${website.jsContent}</script>
</body>
</html>
  `;

  const handleDownload = () => {
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${website.title.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDelete = () => {
    if (confirm('Delete this website?')) {
      WebsiteStorageService.deleteWebsite(website.id);
      setSearchParams({ view: 'pitch_deck' });
    }
  };

  const handleBack = () => {
    setSearchParams({ view: 'pitch_deck' });
  };

  return (
    <div className="flex flex-col h-full gap-4 p-6 animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Pitch Deck
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              {website.title}
            </h1>
            <p className="text-sm text-slate-400">
              Generated on {new Date(website.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleOpenNewTab}>
            <ExternalLink size={16} className="mr-2" />
            Open in New Tab
          </Button>
          <Button variant="secondary" onClick={handleDownload}>
            <Download size={16} className="mr-2" />
            Download HTML
          </Button>
          <Button variant="ghost" onClick={handleDelete}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <iframe
        srcDoc={fullHTML}
        className="flex-1 bg-white rounded-lg border-2 border-slate-700"
        title="Website Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
