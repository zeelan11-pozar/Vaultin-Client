"use client"

import React, { useState } from 'react'
import { FileText, Download, ZoomIn, ZoomOut, RotateCw, Maximize } from 'lucide-react'

interface DocumentViewerProps {
  src: string
  title: string
  fileName: string
  className?: string
}

export function DocumentViewer({ src, title, fileName, className = "" }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = src
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleFullscreen = () => {
    window.open(src, '_blank')
  }

  const isPDF = fileName.toLowerCase().endsWith('.pdf') || src.toLowerCase().includes('.pdf')

  return (
    <div className={`bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      {/* Controls Bar */}
      <div className="bg-gray-800 text-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5" />
          <span className="text-sm font-medium truncate max-w-xs">{fileName}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <span className="text-sm min-w-[3rem] text-center">{zoom}%</span>
          
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-gray-600 mx-2" />

          <button
            onClick={handleRotate}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleFullscreen}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Open in New Tab"
          >
            <Maximize className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Content */}
      <div className="relative aspect-video bg-white">
        {isPDF ? (
          <div className="w-full h-full">
            <iframe
              src={`${src}#toolbar=1&navpanes=1&scrollbar=1&page=1&view=FitH&zoom=${zoom}`}
              className="w-full h-full border-0"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
              title={title}
            />
          </div>
        ) : (
          /* For non-PDF documents, show a placeholder with download option */
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600 mb-4">Preview not available for this file type</p>
              <button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
              >
                <Download className="w-4 h-4" />
                <span>Download to View</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Document Info */}
      <div className="bg-gray-50 p-3 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Document: {fileName}</span>
          <span>Format: {isPDF ? 'PDF' : fileName.split('.').pop()?.toUpperCase() || 'Unknown'}</span>
        </div>
      </div>
    </div>
  )
}
