import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const RenderableBlock = ({ block, isPreviewMode, onUpdateBlock }) => {
  const blockStyle = {
    backgroundColor: block.styles.backgroundColor,
    color: block.styles.color,
    padding: block.styles.padding,
    textAlign: block.styles.textAlign,
    fontSize: block.styles.fontSize,
    minHeight: '60px'
  };

  const updateContent = (key, value) => {
    if (onUpdateBlock) {
      const updatedBlock = {
        ...block,
        content: {
          ...block.content,
          [key]: value
        }
      };
      onUpdateBlock(updatedBlock);
    }
  };

  const renderBlock = () => {
    switch (block.type) {
      case 'navbar-logo':
        return (
          <div style={blockStyle} className="py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              {isPreviewMode ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded"></div>
                    <span className="font-bold text-xl">{block.content.logoText || 'Brand'}</span>
                  </div>
                  <nav className="hidden md:flex items-center gap-6">
                    <a href="#" className="hover:opacity-80">{block.content.link1 || 'Home'}</a>
                    <a href="#" className="hover:opacity-80">{block.content.link2 || 'About'}</a>
                    <a href="#" className="hover:opacity-80">{block.content.link3 || 'Services'}</a>
                    <a href="#" className="hover:opacity-80">{block.content.link4 || 'Contact'}</a>
                  </nav>
                  <Button size="sm">{block.content.ctaText || 'Get Started'}</Button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded"></div>
                    <input
                      className="font-bold text-xl bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded"
                      value={block.content.logoText || ''}
                      onChange={(e) => updateContent('logoText', e.target.value)}
                      placeholder="Brand"
                      style={{ color: block.styles.color }}
                    />
                  </div>
                  <div className="flex gap-4">
                    <input
                      className="bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded text-sm"
                      value={block.content.link1 || ''}
                      onChange={(e) => updateContent('link1', e.target.value)}
                      placeholder="Home"
                      style={{ color: block.styles.color }}
                    />
                    <input
                      className="bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded text-sm"
                      value={block.content.link2 || ''}
                      onChange={(e) => updateContent('link2', e.target.value)}
                      placeholder="About"
                      style={{ color: block.styles.color }}
                    />
                    <input
                      className="bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded text-sm"
                      value={block.content.link3 || ''}
                      onChange={(e) => updateContent('link3', e.target.value)}
                      placeholder="Services"
                      style={{ color: block.styles.color }}
                    />
                    <input
                      className="bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded text-sm"
                      value={block.content.link4 || ''}
                      onChange={(e) => updateContent('link4', e.target.value)}
                      placeholder="Contact"
                      style={{ color: block.styles.color }}
                    />
                  </div>
                  <input
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                    value={block.content.ctaText || ''}
                    onChange={(e) => updateContent('ctaText', e.target.value)}
                    placeholder="Get Started"
                  />
                </>
              )}
            </div>
          </div>
        );

      case 'navbar-text':
        return (
          <div style={blockStyle} className="py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              {isPreviewMode ? (
                <>
                  <span className="font-bold text-xl">{block.content.brandText || 'Company'}</span>
                  <nav className="hidden md:flex items-center gap-6">
                    <a href="#" className="hover:opacity-80">{block.content.link1 || 'Home'}</a>
                    <a href="#" className="hover:opacity-80">{block.content.link2 || 'About'}</a>
                    <a href="#" className="hover:opacity-80">{block.content.link3 || 'Services'}</a>
                    <a href="#" className="hover:opacity-80">{block.content.link4 || 'Contact'}</a>
                  </nav>
                  <Button size="sm">{block.content.ctaText || 'Get Started'}</Button>
                </>
              ) : (
                <>
                  <input
                    className="font-bold text-xl bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded"
                    value={block.content.brandText || ''}
                    onChange={(e) => updateContent('brandText', e.target.value)}
                    placeholder="Company"
                    style={{ color: block.styles.color }}
                  />
                  <div className="flex gap-4">
                    <input
                      className="bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded text-sm"
                      value={block.content.link1 || ''}
                      onChange={(e) => updateContent('link1', e.target.value)}
                      placeholder="Home"
                      style={{ color: block.styles.color }}
                    />
                    <input
                      className="bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded text-sm"
                      value={block.content.link2 || ''}
                      onChange={(e) => updateContent('link2', e.target.value)}
                      placeholder="About"
                      style={{ color: block.styles.color }}
                    />
                    <input
                      className="bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded text-sm"
                      value={block.content.link3 || ''}
                      onChange={(e) => updateContent('link3', e.target.value)}
                      placeholder="Services"
                      style={{ color: block.styles.color }}
                    />
                    <input
                      className="bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded text-sm"
                      value={block.content.link4 || ''}
                      onChange={(e) => updateContent('link4', e.target.value)}
                      placeholder="Contact"
                      style={{ color: block.styles.color }}
                    />
                  </div>
                  <input
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                    value={block.content.ctaText || ''}
                    onChange={(e) => updateContent('ctaText', e.target.value)}
                    placeholder="Get Started"
                  />
                </>
              )}
            </div>
          </div>
        );

      case 'footer':
        return (
          <div style={blockStyle} className="py-8">
            <div className="max-w-6xl mx-auto">
              {isPreviewMode ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h4 className="font-bold mb-4">{block.content.col1Title || 'Company'}</h4>
                    <ul className="space-y-2 text-sm opacity-80">
                      <li><a href="#" className="hover:opacity-100">{block.content.col1Link1 || 'About Us'}</a></li>
                      <li><a href="#" className="hover:opacity-100">{block.content.col1Link2 || 'Careers'}</a></li>
                      <li><a href="#" className="hover:opacity-100">{block.content.col1Link3 || 'Contact'}</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-4">{block.content.col2Title || 'Product'}</h4>
                    <ul className="space-y-2 text-sm opacity-80">
                      <li><a href="#" className="hover:opacity-100">{block.content.col2Link1 || 'Features'}</a></li>
                      <li><a href="#" className="hover:opacity-100">{block.content.col2Link2 || 'Pricing'}</a></li>
                      <li><a href="#" className="hover:opacity-100">{block.content.col2Link3 || 'Documentation'}</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-4">{block.content.col3Title || 'Support'}</h4>
                    <ul className="space-y-2 text-sm opacity-80">
                      <li><a href="#" className="hover:opacity-100">{block.content.col3Link1 || 'Help Center'}</a></li>
                      <li><a href="#" className="hover:opacity-100">{block.content.col3Link2 || 'Community'}</a></li>
                      <li><a href="#" className="hover:opacity-100">{block.content.col3Link3 || 'Status'}</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-4">{block.content.col4Title || 'Legal'}</h4>
                    <ul className="space-y-2 text-sm opacity-80">
                      <li><a href="#" className="hover:opacity-100">{block.content.col4Link1 || 'Privacy'}</a></li>
                      <li><a href="#" className="hover:opacity-100">{block.content.col4Link2 || 'Terms'}</a></li>
                      <li><a href="#" className="hover:opacity-100">{block.content.col4Link3 || 'Cookies'}</a></li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map(colNum => (
                    <div key={colNum}>
                      <input
                        className="font-bold mb-4 bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded w-full"
                        value={block.content[`col${colNum}Title`] || ''}
                        onChange={(e) => updateContent(`col${colNum}Title`, e.target.value)}
                        placeholder={['Company', 'Product', 'Support', 'Legal'][colNum - 1]}
                        style={{ color: block.styles.color }}
                      />
                      <div className="space-y-2">
                        {[1, 2, 3].map(linkNum => (
                          <input
                            key={linkNum}
                            className="block text-sm opacity-80 bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded w-full"
                            value={block.content[`col${colNum}Link${linkNum}`] || ''}
                            onChange={(e) => updateContent(`col${colNum}Link${linkNum}`, e.target.value)}
                            placeholder={`Link ${linkNum}`}
                            style={{ color: block.styles.color }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm opacity-60">
                {isPreviewMode ? (
                  <p>{block.content.copyright || '© 2024 Your Company. All rights reserved.'}</p>
                ) : (
                  <input
                    className="bg-transparent border border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-2 py-1 rounded w-full text-center"
                    value={block.content.copyright || ''}
                    onChange={(e) => updateContent('copyright', e.target.value)}
                    placeholder="© 2024 Your Company. All rights reserved."
                    style={{ color: block.styles.color }}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 'hero':
        return (
          <div style={blockStyle} className="py-16">
            <div className="max-w-4xl mx-auto">
              {isPreviewMode ? (
                <>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    {block.content.title || 'Your Amazing Headline'}
                  </h1>
                  <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                    {block.content.subtitle || 'Compelling subtitle that converts visitors into customers'}
                  </p>
                  <Button size="lg" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                    {block.content.buttonText || 'Get Started'}
                  </Button>
                </>
              ) : (
                <>
                  <input
                    className="text-4xl md:text-6xl font-bold mb-6 leading-tight bg-transparent border-2 border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none w-full p-2 rounded"
                    value={block.content.title || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Your Amazing Headline"
                    style={{ color: block.styles.color }}
                  />
                  <textarea
                    className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed bg-transparent border-2 border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none w-full p-2 rounded resize-none"
                    value={block.content.subtitle || ''}
                    onChange={(e) => updateContent('subtitle', e.target.value)}
                    placeholder="Compelling subtitle that converts visitors into customers"
                    style={{ color: block.styles.color }}
                    rows={2}
                  />
                  <input
                    className="bg-white text-blue-600 font-semibold px-8 py-3 rounded border-2 border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none"
                    value={block.content.buttonText || ''}
                    onChange={(e) => updateContent('buttonText', e.target.value)}
                    placeholder="Get Started"
                  />
                </>
              )}
            </div>
          </div>
        );

      case 'text':
        return (
          <div style={blockStyle}>
            <div className="max-w-4xl mx-auto">
              {isPreviewMode ? (
                <div 
                  className="text-lg leading-relaxed"
                  style={{ whiteSpace: 'pre-wrap' }}
                  dangerouslySetInnerHTML={{ 
                    __html: (block.content.text || 'Add your text content here. Click to edit and customize.').replace(/\n/g, '<br>') 
                  }}
                />
              ) : (
                <textarea
                  className="w-full text-lg leading-relaxed bg-transparent border-2 border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none p-4 rounded min-h-[100px] resize-y"
                  value={block.content.text || ''}
                  onChange={(e) => updateContent('text', e.target.value)}
                  placeholder="Add your text content here. Click to edit and customize."
                  style={{ color: block.styles.color }}
                />
              )}
            </div>
          </div>
        );

      case 'image':
        return (
          <div style={blockStyle}>
            <div className="max-w-4xl mx-auto">
              {isPreviewMode ? (
                <img
                  src={block.content.src || '/placeholder.svg'}
                  alt={block.content.alt || 'Image'}
                  className="w-full h-auto rounded-lg shadow-lg max-h-96 object-cover"
                  style={{ maxHeight: '400px' }}
                />
              ) : (
                <div className="space-y-4">
                  <img
                    src={block.content.src || '/placeholder.svg'}
                    alt={block.content.alt || 'Image'}
                    className="w-full h-auto rounded-lg shadow-lg max-h-96 object-cover"
                    style={{ maxHeight: '400px' }}
                  />
                  <div className="space-y-2">
                    <input
                      type="url"
                      className="w-full p-2 border-2 border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none rounded"
                      value={block.content.src || ''}
                      onChange={(e) => updateContent('src', e.target.value)}
                      placeholder="Image URL"
                    />
                    <input
                      type="text"
                      className="w-full p-2 border-2 border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none rounded"
                      value={block.content.alt || ''}
                      onChange={(e) => updateContent('alt', e.target.value)}
                      placeholder="Alt text"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'button':
        return (
          <div style={blockStyle}>
            <div className="max-w-4xl mx-auto">
              {isPreviewMode ? (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-shadow"
                  style={{ 
                    backgroundColor: block.styles.backgroundColor === '#ffffff' ? '#3b82f6' : 'inherit',
                    color: block.styles.backgroundColor === '#ffffff' ? '#ffffff' : 'inherit'
                  }}
                >
                  {block.content.text || 'Click Me'}
                </Button>
              ) : (
                <div className="space-y-2">
                  <input
                    className="text-lg px-8 py-6 font-semibold shadow-lg border-2 border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none rounded"
                    value={block.content.text || ''}
                    onChange={(e) => updateContent('text', e.target.value)}
                    placeholder="Button text"
                    style={{ 
                      backgroundColor: block.styles.backgroundColor === '#ffffff' ? '#3b82f6' : block.styles.backgroundColor,
                      color: block.styles.backgroundColor === '#ffffff' ? '#ffffff' : block.styles.color
                    }}
                  />
                  <input
                    type="url"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={block.content.link || ''}
                    onChange={(e) => updateContent('link', e.target.value)}
                    placeholder="Link URL (optional)"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div style={blockStyle}>
            <div className="max-w-2xl mx-auto">
              {isPreviewMode ? (
                <>
                  <h3 className="text-3xl font-bold mb-8">
                    {block.content.title || 'Contact Us'}
                  </h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                        placeholder="Your Name" 
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/70" 
                      />
                      <Input 
                        type="email" 
                        placeholder="Your Email" 
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/70" 
                      />
                    </div>
                    <Input 
                      placeholder="Company Name" 
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/70" 
                    />
                    <Textarea 
                      placeholder="Tell us about your project..." 
                      className="min-h-[120px] bg-white/10 border-white/20 text-white placeholder:text-white/70" 
                    />
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full text-lg py-6 bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                    >
                      Send Message
                    </Button>
                  </form>
                </>
              ) : (
                <div className="space-y-4">
                  <input
                    className="text-3xl font-bold mb-8 bg-transparent border-2 border-dashed border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none w-full p-2 rounded"
                    value={block.content.title || ''}
                    onChange={(e) => updateContent('title', e.target.value)}
                    placeholder="Contact Us"
                    style={{ color: block.styles.color }}
                  />
                  <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded">
                    Contact form preview - fields will be functional in preview mode
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div style={blockStyle}>
            <div className="max-w-4xl mx-auto">
              <p className="text-red-500">Unknown block type: {block.type}</p>
            </div>
          </div>
        );
    }
  };

  return renderBlock();
};
