import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Select from './Select';

const ExportShareControls = ({ 
  dashboardContext = 'overview',
  onExport,
  onShare,
  className = "" 
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportRange, setExportRange] = useState('current');
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { value: 'pdf', label: 'PDF Report', description: 'Formatted dashboard report' },
    { value: 'excel', label: 'Excel Spreadsheet', description: 'Raw data with charts' },
    { value: 'csv', label: 'CSV Data', description: 'Raw data only' },
    { value: 'png', label: 'PNG Image', description: 'Dashboard screenshot' }
  ];

  const exportRanges = [
    { value: 'current', label: 'Current View' },
    { value: 'all', label: 'All Data' },
    { value: 'filtered', label: 'Filtered Data' }
  ];

  const shareOptions = [
    { value: 'link', label: 'Share Link', icon: 'Link' },
    { value: 'email', label: 'Email Report', icon: 'Mail' },
    { value: 'schedule', label: 'Schedule Report', icon: 'Calendar' },
    { value: 'embed', label: 'Embed Code', icon: 'Code' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport?.({
        format: exportFormat,
        range: exportRange,
        context: dashboardContext
      });
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setIsExportOpen(false);
      }, 2000);
    }
  };

  const handleShare = (option) => {
    onShare?.({
      type: option,
      context: dashboardContext
    });
    setIsShareOpen(false);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Export Dropdown */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExportOpen(!isExportOpen)}
          iconName="Download"
          iconPosition="left"
        >
          Export
        </Button>

        {isExportOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-lg p-4 z-50">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-popover-foreground mb-2">Export Format</h4>
                <Select
                  options={exportFormats}
                  value={exportFormat}
                  onChange={setExportFormat}
                  className="w-full"
                />
              </div>

              <div>
                <h4 className="text-sm font-medium text-popover-foreground mb-2">Data Range</h4>
                <Select
                  options={exportRanges}
                  value={exportRange}
                  onChange={setExportRange}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExportOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleExport}
                  loading={isExporting}
                  iconName="Download"
                  iconPosition="left"
                >
                  Export
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Share Dropdown */}
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsShareOpen(!isShareOpen)}
          iconName="Share"
          iconPosition="left"
        >
          Share
        </Button>

        {isShareOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-lg py-2 z-50">
            {shareOptions?.map((option) => (
              <button
                key={option?.value}
                onClick={() => handleShare(option?.value)}
                className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Icon name={option?.icon} size={16} />
                <span>{option?.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <Button
        variant="ghost"
        size="sm"
        iconName="Printer"
        title="Print Dashboard"
        onClick={() => window.print()}
      />
      <Button
        variant="ghost"
        size="sm"
        iconName="Bookmark"
        title="Save View"
        onClick={() => {/* Save current view logic */}}
      />
      {/* Click outside handler */}
      {(isExportOpen || isShareOpen) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setIsExportOpen(false);
            setIsShareOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ExportShareControls;