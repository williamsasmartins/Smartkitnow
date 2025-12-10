import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import CalculatorVerticalLayout from '@/components/templates/CalculatorVerticalLayout';
import useFaqJsonLd from '@/hooks/useFaqJsonLd';
import { QrCode, Link as LinkIcon, MessageSquare, User, Download, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TRANSLATIONS = {
  "en-US": {
    appTitle: "QR Code Generator",
    appDescription: "Generate QR codes for URLs, text, and contact information",
    urlTab: "URL",
    textTab: "Text",
    contactTab: "Contact",
    enterUrl: "Enter URL",
    enterText: "Enter Text",
    contactInformation: "Contact Information",
    websiteUrl: "Website URL",
    urlPlaceholder: "example.com or https://example.com",
    urlHelp: "Enter a website URL. If you don't include http://, we'll add https:// automatically.",
    textContent: "Text Content",
    textPlaceholder: "Enter any text to generate QR code...",
    firstName: "First Name",
    firstNamePlaceholder: "John",
    lastName: "Last Name",
    lastNamePlaceholder: "Doe",
    phoneNumber: "Phone Number",
    phonePlaceholder: "+1 (555) 123-4567",
    emailAddress: "Email Address",
    emailPlaceholder: "john.doe@example.com",
    organization: "Organization",
    organizationPlaceholder: "Company Name",
    website: "Website",
    websitePlaceholder: "https://example.com",
    clearAllFields: "Clear All Fields",
    generatedQrCode: "Generated QR Code",
    scanQrCode: "Scan this QR code with your device",
    fillFormPrompt: "Fill in the form to generate your QR code",
    download: "Download",
    copyData: "Copy Data",
    copied: "Copied!",
    qrCodeData: "QR Code Data:",
    footerText: "Generate QR codes instantly • No data stored • Free to use",
    qrCodeAlt: "Generated QR Code",
  },
};

// Always English
const t = (key: keyof typeof TRANSLATIONS['en-US']) => TRANSLATIONS['en-US'][key] || String(key);

const QRCodeGenerator = () => {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'url' | 'text' | 'contact'>('url');
  const [qrData, setQrData] = useState('');
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    organization: '',
    url: ''
  });
  const [size, setSize] = useState<number>(300);
  const [margin, setMargin] = useState<number>(2);
  const [ecc, setEcc] = useState<'L'|'M'|'Q'|'H'>('M');
  const [format, setFormat] = useState<'png'|'svg'>('png');
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [autoColors, setAutoColors] = useState<boolean>(true);
  const [moduleColor, setModuleColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');

  // Sync colors with theme when auto mode is enabled
  useEffect(() => {
    if (autoColors) {
      const isDark = resolvedTheme === 'dark' || document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
      setModuleColor(isDark ? '#ffffff' : '#000000');
      setBgColor(isDark ? '#0f172a' : '#ffffff');
    }
  }, [resolvedTheme, autoColors]);

  const generateQRCode = async (text: string) => {
    if (!text.trim()) {
      if (qrContainerRef.current) {
        qrContainerRef.current.innerHTML = '';
      }
      return;
    }
    try {
      if (!qrContainerRef.current) return;
      qrContainerRef.current.innerHTML = '';
      const canvas = document.createElement('canvas');
      canvasRef.current = canvas;
      qrContainerRef.current.appendChild(canvas);
      const isDark = resolvedTheme === 'dark' || document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
      const darkColor = autoColors ? (isDark ? '#ffffff' : '#000000') : moduleColor;
      const lightColor = autoColors ? (isDark ? '#0f172a' : '#ffffff') : bgColor;
      if (format === 'png') {
        await QRCode.toCanvas(canvas, text, {
          errorCorrectionLevel: ecc,
          margin,
          width: size,
          color: {
            dark: darkColor,
            light: lightColor,
          },
        });
        setSvgMarkup(null);
      } else {
        const svg = (await QRCode.toString(text, {
          errorCorrectionLevel: ecc,
          margin,
          width: size,
          type: 'svg',
          color: {
            dark: darkColor,
            light: lightColor,
          },
        } as any)) as unknown as string;
        setSvgMarkup(svg);
        canvas.remove();
        const container = document.createElement('div');
        container.innerHTML = svg;
        qrContainerRef.current.appendChild(container);
      }
      canvas.className = 'w-full h-auto rounded-xl shadow-lg bg-white dark:bg-slate-900';
      canvas.style.maxWidth = '300px';
      canvas.style.height = 'auto';
    } catch (error) {
      console.error('Error creating QR code:', error);
      generateFallbackQR(text);
    }
  };

  const generateFallbackQR = (text: string) => {
    if (!qrContainerRef.current) return;
    qrContainerRef.current.innerHTML = '';
    const img = document.createElement('img');
    const encodedData = encodeURIComponent(text);
    const isDark = resolvedTheme === 'dark' || document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveModule = autoColors ? (isDark ? '#ffffff' : '#000000') : moduleColor;
    const effectiveBg = autoColors ? (isDark ? '#0f172a' : '#ffffff') : bgColor;
    const color = effectiveModule.replace('#', '');
    const bgcolor = effectiveBg.replace('#', '');
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&format=png&margin=${margin}&color=${color}&bgcolor=${bgcolor}`;
    img.alt = t('qrCodeAlt');
    img.className = 'w-full h-auto rounded-xl shadow-lg bg-white dark:bg-slate-900 p-4';
    img.style.maxWidth = '300px';
    img.style.height = 'auto';
    qrContainerRef.current.appendChild(img);
  };

  const formatUrl = (url: string) => {
    if (!url.trim()) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  };

  const generateVCard = (contact: typeof contactInfo) => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${contact.firstName} ${contact.lastName}\nN:${contact.lastName};${contact.firstName};;;\nORG:${contact.organization}\nTEL:${contact.phone}\nEMAIL:${contact.email}\nURL:${contact.url}\nEND:VCARD`;
    return vcard;
  };

  useEffect(() => {
    let data = '';
    switch (activeTab) {
      case 'url':
        data = formatUrl(urlInput);
        break;
      case 'text':
        data = textInput;
        break;
      case 'contact':
        if (contactInfo.firstName || contactInfo.lastName || contactInfo.phone || contactInfo.email) {
          data = generateVCard(contactInfo);
        }
        break;
      default:
        data = '';
    }
    setQrData(data);
    generateQRCode(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, urlInput, textInput, contactInfo, size, margin, ecc, format, resolvedTheme, autoColors, moduleColor, bgColor]);

  const applyPreset = (preset: 'high' | 'brand-light' | 'brand-dark') => {
    setAutoColors(false);
    const brand = getComputedStyle(document.documentElement).getPropertyValue('--skn-brand').trim() || '#2563eb';
    if (preset === 'high') {
      setModuleColor('#000000');
      setBgColor('#ffffff');
    } else if (preset === 'brand-light') {
      setModuleColor(brand);
      setBgColor('#ffffff');
    } else {
      setModuleColor(brand);
      setBgColor('#0f172a');
    }
  };

  const downloadQRCode = () => {
    if (!qrData) return;
    const canvas = qrContainerRef.current?.querySelector('canvas');
    const img = qrContainerRef.current?.querySelector('img');
    if (format === 'svg' && svgMarkup) {
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}.png`;
      link.href = (canvas as HTMLCanvasElement).toDataURL();
      link.click();
    } else if (img) {
      const link = document.createElement('a');
      link.download = `qr-code-${activeTab}.png`;
      link.href = (img as HTMLImageElement).src;
      link.click();
    }
  };

  const copyToClipboard = async () => {
    if (qrData) {
      try {
        await navigator.clipboard.writeText(qrData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const resetForm = () => {
    setUrlInput('');
    setTextInput('');
    setContactInfo({ firstName: '', lastName: '', phone: '', email: '', organization: '', url: '' });
    setQrData('');
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = '';
    }
  };

  const tabs = [
    { id: 'url', label: t('urlTab'), icon: LinkIcon },
    { id: 'text', label: t('textTab'), icon: MessageSquare },
    { id: 'contact', label: t('contactTab'), icon: User },
  ];

  const widget = (
    <div className="calculator-safe-zone">
      {/* Tabs (shadcn) */}
      <div className="mb-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon as any;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id as any}
                  className="px-4 py-2 rounded-lg data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"
                >
                  <IconComponent className="w-4 h-4 mr-2" /> {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Inputs + Preview */}
      <div className="space-y-8 p-6">
        {/* Inputs Card */}
        <Card className="border-0 shadow-none">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <LinkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              QR details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            {activeTab === 'url' && (
              <div>
                <Label className="mb-2">{t('websiteUrl')}</Label>
                <Input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder={t('urlPlaceholder')} className="h-11 text-base" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('urlHelp')}</p>
              </div>
            )}

            {activeTab === 'text' && (
              <div>
                <Label className="mb-2">{t('textContent')}</Label>
                <Textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder={t('textPlaceholder')} rows={4} className="w-full" />
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2">{t('firstName')}</Label>
                    <Input value={contactInfo.firstName} onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })} placeholder={t('firstNamePlaceholder')} className="h-11" />
                  </div>
                  <div>
                    <Label className="mb-2">{t('lastName')}</Label>
                    <Input value={contactInfo.lastName} onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })} placeholder={t('lastNamePlaceholder')} className="h-11" />
                  </div>
                </div>
                <div>
                  <Label className="mb-2">{t('phoneNumber')}</Label>
                  <Input type="tel" value={contactInfo.phone} onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })} placeholder={t('phonePlaceholder')} className="h-11" />
                </div>
                <div>
                  <Label className="mb-2">{t('emailAddress')}</Label>
                  <Input type="email" value={contactInfo.email} onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })} placeholder={t('emailPlaceholder')} className="h-11" />
                </div>
                <div>
                  <Label className="mb-2">{t('organization')}</Label>
                  <Input value={contactInfo.organization} onChange={(e) => setContactInfo({ ...contactInfo, organization: e.target.value })} placeholder={t('organizationPlaceholder')} className="h-11" />
                </div>
                <div>
                  <Label className="mb-2">{t('website')}</Label>
                  <Input type="url" value={contactInfo.url} onChange={(e) => setContactInfo({ ...contactInfo, url: e.target.value })} placeholder={t('websitePlaceholder')} className="h-11" />
                </div>
              </div>
            )}

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="mb-2">Size (px)</Label>
                <Input type="number" min={128} max={1024} value={size} onChange={(e) => setSize(Math.max(128, Math.min(1024, Number(e.target.value) || 300)))} className="h-11" />
              </div>
              <div>
                <Label className="mb-2">Margin</Label>
                <Input type="number" min={0} max={16} value={margin} onChange={(e) => setMargin(Math.max(0, Math.min(16, Number(e.target.value) || 2)))} className="h-11" />
              </div>
              <div>
                <Label className="mb-2">Error correction (ECC)</Label>
                <Select value={ecc} onValueChange={(v) => setEcc(v as 'L'|'M'|'Q'|'H')}>
                  <SelectTrigger className="w-full" aria-label="ECC">
                    <SelectValue placeholder="Select ECC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="Q">Q</SelectItem>
                    <SelectItem value="H">H</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-2">Format</Label>
                <Select value={format} onValueChange={(v) => setFormat(v as 'png'|'svg')}>
                  <SelectTrigger className="w-full" aria-label="Format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="svg">SVG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color controls */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Module color</Label>
                  <input type="color" value={moduleColor} disabled={autoColors} onChange={(e) => setModuleColor(e.target.value)} className="w-full h-10 p-1 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900" />
                </div>
                <div>
                  <Label className="mb-2">Background color</Label>
                  <input type="color" value={bgColor} disabled={autoColors} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 p-1 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input id="autoColors" type="checkbox" checked={autoColors} onChange={(e) => setAutoColors(e.target.checked)} />
                <label htmlFor="autoColors" className="text-sm text-slate-700 dark:text-slate-200">Auto theme colors</label>
                <Button type="button" variant="outline" className="ml-auto" onClick={() => {
                  const brand = getComputedStyle(document.documentElement).getPropertyValue('--skn-brand').trim();
                  if (brand) { setAutoColors(false); setModuleColor(brand); }
                }}>
                  Use Brand Color
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={resetForm}>{t('clearAllFields')}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
              Generated QR Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 w-full">
              {qrData ? (
                <div className="text-center">
                  <div ref={qrContainerRef} className="flex justify-center"></div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-4">{t('scanQrCode')}</p>
                </div>
              ) : (
                <div className="text-center py-16">
                  <QrCode className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">{t('fillFormPrompt')}</p>
                </div>
              )}
            </div>
            {qrData && (
              <div className="flex gap-4 w-full mt-4">
                <Button onClick={downloadQRCode} className="flex-1">
                  <Download className="w-4 h-4 mr-2" /> {format === 'svg' ? 'Download SVG' : t('download')}
                </Button>
                <Button variant="outline" onClick={copyToClipboard} className="flex-1">
                  {copied ? (<><Check className="w-4 h-4 mr-2 text-green-600" /> {t('copied')}</>) : (<><Copy className="w-4 h-4 mr-2" /> {t('copyData')}</>)}
                </Button>
              </div>
            )}
            {qrData && (
              <div className="w-full mt-4">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">{t('qrCodeData')}</h3>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-300 max-h-32 overflow-y-auto">
                  <pre className="whitespace-pre-wrap break-words">{qrData}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const faqs = [
    { question: 'What is a QR code and how does it work?', answer: 'A QR code stores information such as URLs or text. Scanning it decodes and triggers actions like opening links or saving contacts.' },
    { question: 'What types of information can I encode?', answer: 'URLs, plain text, contact info (vCard), phone, email, WiFi, and more. This generator supports URL, Text, and Contact formats.' },
    { question: 'What is error correction level?', answer: 'Levels: L (7%), M (15%), Q (25%), H (30%). Use M generally; H for partially covered or printed codes.' },
    { question: 'Recommended sizes for printing?', answer: 'At least 2×2 cm for business cards; larger for posters. Default 300×300 is suitable for many cases.' },
    { question: 'Do QR codes expire?', answer: 'Static QR codes don’t expire. If the URL target goes offline, the link fails but the code remains valid.' },
    { question: 'Are QR codes secure?', answer: 'The code is safe; verify unknown sources. This tool generates client-side codes and never sends data to servers.' },
    { question: 'PNG vs SVG?', answer: 'PNG suits digital use. SVG scales infinitely for professional print without pixelation.' },
    { question: 'Do you store data?', answer: 'No. All generation occurs locally in your browser for privacy.' },
  ];
  const faqJsonLd = useFaqJsonLd(faqs);

  const editorial = (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">How it works</h2>
      <p>Enter a URL, text, or contact details. Adjust size, margin, error correction, and format. Download as PNG or SVG.</p>
    </div>
  );

  return (
    <CalculatorVerticalLayout
      title={t('appTitle')}
      description={t('appDescription')}
      widget={widget}
      editorial={editorial}
      jsonLd={faqJsonLd ?? undefined}
      onThisPage={[
        { id: 'introduction', label: 'Getting started' },
        { id: 'faq', label: 'FAQs' },
      ]}
      relatedCalculators={[
        { title: 'Unit Converter', url: '/conversion/unit-converter', icon: '🔁' },
        { title: 'Loan Payment Calculator', url: '/financial/loan-payment', icon: '💵' },
        { title: 'BMI Calculator', url: '/health/bmi-calculator', icon: '⚖️' },
      ]}
    />
  );
};

export default QRCodeGenerator;
