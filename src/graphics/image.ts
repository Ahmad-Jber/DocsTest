import type { ChangeEvent } from 'react';
import type { PDFImage, PDFEmbeddedPage } from '@pdfme/pdf-lib';
import type { Plugin } from '@pdfme/common';
import type { PDFRenderProps, Schema } from '@pdfme/common';
import type * as CSS from 'csstype';
import { UIRenderProps } from '@pdfme/common';
import { convertForPdfLayoutProps, addAlphaToHex, isEditable, readFile } from './utils';
import { DEFAULT_OPACITY } from './constants';
import { getImageDimension } from './imagehelper';
import { isPdf, pdfToImage } from './pdfHelper';

const px2mm = (px: number): number => {
  // http://www.endmemo.com/sconvert/millimeterpixel.php
  const ratio = 0.26458333333333;
  return parseFloat(String(px)) * ratio;
};

const getCacheKey = (schema: Schema, input: string) => `${schema.type}${input}`;
const fullSize = { width: '100%', height: '100%' };
const defaultValue =
  'data:image/png;base64,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';

export interface ImageSchema extends Schema {}

const imageSchema: Plugin<ImageSchema> = {
  pdf: async (arg: PDFRenderProps<ImageSchema>) => {
    const { value, schema, pdfDoc, page, _cache } = arg;
    const isGraphicPdf = isPdf(value);
    const isImageOrPdf = value.startsWith('data:image/') || isGraphicPdf;
    if (!value || !isImageOrPdf) return;

    const inputImageCacheKey = getCacheKey(schema, value);
    let image = _cache.get(inputImageCacheKey) as PDFImage | PDFEmbeddedPage;
    if (!image) {
      if (isGraphicPdf) {
        [image] = await pdfDoc.embedPdf(value);
      } else {
        const isPng = value.startsWith('data:image/png;');
        image = await (isPng ? pdfDoc.embedPng(value) : pdfDoc.embedJpg(value));
      }
      _cache.set(inputImageCacheKey, image);
    }

    const _schema = { ...schema, position: { ...schema.position } };
    const dimension = isGraphicPdf ? image.scale(1) : getImageDimension(value);
    const imageWidth = px2mm(dimension.width);
    const imageHeight = px2mm(dimension.height);
    const boxWidth = _schema.width;
    const boxHeight = _schema.height;

    const imageRatio = imageWidth / imageHeight;
    const boxRatio = boxWidth / boxHeight;

    if (imageRatio > boxRatio) {
      _schema.width = boxWidth;
      _schema.height = boxWidth / imageRatio;
      _schema.position.y += (boxHeight - _schema.height) / 2;
    } else {
      _schema.width = boxHeight * imageRatio;
      _schema.height = boxHeight;
      _schema.position.x += (boxWidth - _schema.width) / 2;
    }

    const pageHeight = page.getHeight();
    const lProps = convertForPdfLayoutProps({ schema: _schema, pageHeight });
    const { width, height, rotate, position, opacity } = lProps;
    const { x, y } = position;

    const drawOptions = { x, y, rotate, width, height, opacity };
    isGraphicPdf
      ? page.drawPage(image as PDFEmbeddedPage, drawOptions)
      : page.drawImage(image as PDFImage, drawOptions);
  },
  ui: async (arg: UIRenderProps<ImageSchema>) => {
    const {
      value,
      rootElement,
      mode,
      onChange,
      stopEditing,
      tabIndex,
      placeholder,
      theme,
      schema,
    } = arg;
    const editable = isEditable(mode, schema);
    const isDefault = value === defaultValue;

    const container = document.createElement('div');
    const backgroundStyle = placeholder ? `url(${placeholder})` : 'none';
    const containerStyle: CSS.Properties = {
      ...fullSize,
      backgroundImage: value ? 'none' : backgroundStyle,
      backgroundSize: `contain`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    };
    Object.assign(container.style, containerStyle);
    container.addEventListener('click', (e) => {
      if (editable) {
        e.stopPropagation();
      }
    });
    rootElement.appendChild(container);

    // image tag
    if (value) {
      let src = isPdf(value) ? await pdfToImage(arg) : value;
      const img = document.createElement('img');
      const imgStyle: CSS.Properties = {
        height: '100%',
        width: '100%',
        borderRadius: 0,
        objectFit: 'contain',
      };
      Object.assign(img.style, imgStyle);
      img.src = src;
      container.appendChild(img);
    }

    // remove button
    if (value && !isDefault && editable) {
      const button = document.createElement('button');
      button.textContent = 'x';
      const buttonStyle: CSS.Properties = {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#333',
        background: '#f2f2f2',
        borderRadius: '2px',
        border: '1px solid #767676',
        cursor: 'pointer',
        height: '24px',
        width: '24px',
      };
      Object.assign(button.style, buttonStyle);
      button.addEventListener('click', () => {
        onChange && onChange('');
      });
      container.appendChild(button);
    }
  },
  propPanel: {
    schema: {},
    defaultValue,
    defaultSchema: {
      type: 'image',
      position: { x: 0, y: 0 },
      width: 40,
      height: 40,
      // If the value of "rotate" is set to undefined or not set at all, rotation will be disabled in the UI.
      // Check this document: https://pdfme.com//docs/custom-schemas#learning-how-to-create-from-pdfmeschemas-code
      rotate: 0,
      opacity: DEFAULT_OPACITY,
    },
  },
};

export default imageSchema;

export const readOnlyImage: Plugin<ImageSchema> = {
  pdf: imageSchema.pdf,
  ui: imageSchema.ui,
  propPanel: {
    ...imageSchema.propPanel,
    defaultSchema: {
      ...imageSchema.propPanel.defaultSchema,
      type: 'readOnlyImage',
      readOnly: true,
      readOnlyValue: defaultValue,
    },
  },
};
