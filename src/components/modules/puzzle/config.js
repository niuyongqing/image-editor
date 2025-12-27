// src/components/modules/puzzle/config.js

// =========================================================================
// 1. 网格模板数据 - 按图片数量分组
// =========================================================================
// 网格模板数据 - 按图片数量分组
export const gridTemplates = {
  1: [
    {
      id: '1-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(1, 1fr)',
        'grid-template-rows': 'repeat(1, 1fr)',
      },
      gridAreas: ['1 / 1 / 2 / 2'],
    }
  ],
  2: [
    {
      id: '2-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(2, 1fr)',
        'grid-template-rows': 'repeat(2, 1fr)',
      },
      gridAreas: ['1 / 1 / 3 / 2', '1 / 2 / 3 / 3'],
    },
    {
      id: '2-2',
      wrapStyle: {
        'grid-template-columns': 'repeat(2, 1fr)',
        'grid-template-rows': 'repeat(2, 1fr)',
      },
      gridAreas: ['1 / 1 / 2 / 3', '2 / 1 / 3 / 3'],
    }
  ],
  3: [
    {
      id: '3-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(3, 1fr)',
        'grid-template-rows': 'repeat(3, 1fr)',
      },
      gridAreas: ['1 / 1 / 3 / 3', '1 / 3 / 3 / 4', '3 / 1 / 4 / 4'],
    },
    {
      id: '3-2',
      wrapStyle: {
        'grid-template-columns': 'repeat(3, 1fr)',
        'grid-template-rows': 'repeat(3, 1fr)',
      },
      gridAreas: ['1 / 1 / 2 / 4', '2 / 1 / 4 / 3', '2 / 3 / 4 / 4'],
    },
    {
      id: '3-3',
      wrapStyle: {
        'grid-template-columns': 'repeat(2, 1fr)',
        'grid-template-rows': 'repeat(2, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 3 / 2',
        '1 / 2 / 2 / 3',
        '2 / 2 / 3 / 3'
      ],
    },
    {
      id: '3-4',
      wrapStyle: {
        'grid-template-columns': 'repeat(2, 1fr)',
        'grid-template-rows': 'repeat(2, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 2',
        '1 / 2 / 3 / 3',
        '2 / 1 / 3 / 2'
      ],
    },
    {
      id: '3-5',
      wrapStyle: {
        'grid-template-columns': 'repeat(2, 1fr)',
        'grid-template-rows': 'repeat(2, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 3',
        '2 / 1 / 3 / 2',
        '2 / 2 / 3 / 3'
      ],
    },
    {
      id: '3-6',
      wrapStyle: {
        'grid-template-columns': 'repeat(2, 1fr)',
        'grid-template-rows': 'repeat(2, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 2',
        '1 / 2 / 2 / 3',
        '2 / 1 / 3 / 3'
      ],
    },
    {
      id: '3-7',
      wrapStyle: {
        'grid-template-columns': 'repeat(3, 1fr)',
        'grid-template-rows': 'repeat(3, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 4 / 2',
        '1 / 2 / 4 / 3',
        '1 / 3 / 4 / 4'
      ],
    },
    {
      id: '3-8',
      wrapStyle: {
        'grid-template-columns': 'repeat(3, 1fr)',
        'grid-template-rows': 'repeat(3, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 4',
        '2 / 1 / 3 / 4',
        '3 / 1 / 4 / 4'
      ],
    }
  ],
  4: [
    {
      id: '4-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(2, 1fr)',
        'grid-template-rows': 'repeat(2, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 2',
        '1 / 2 / 2 / 3',
        '2 / 1 / 3 / 2',
        '2 / 2 / 3 / 3'
      ],
    },
    {
      id: '4-2',
      wrapStyle: {
        'grid-template-columns': 'repeat(6, 1fr)',
        'grid-template-rows': 'repeat(6, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 4 / 3',
        '1 / 3 / 4 / 7',
        '4 / 1 / 7 / 5',
        '4 / 5 / 7 / 7'
      ],
    },
    {
      id: '4-3',
      wrapStyle: {
        'grid-template-columns': 'repeat(6, 1fr)',
        'grid-template-rows': 'repeat(6, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 7 / 3',
        '1 / 3 / 4 / 5',
        '4 / 3 / 7 / 5',
        '1 / 5 / 7 / 7'
      ],
    },
    {
      id: '4-4',
      wrapStyle: {
        'grid-template-columns': 'repeat(6, 1fr)',
        'grid-template-rows': 'repeat(6, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 3 / 7',
        '3 / 1 / 5 / 4',
        '3 / 4 / 5 / 7',
        '5 / 1 / 7 / 7'
      ],
    },
    {
      id: '4-5',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 5 / 2',
        '1 / 2 / 5 / 3',
        '1 / 3 / 5 / 4',
        '1 / 4 / 5 / 5'
      ],
    },
    {
      id: '4-6',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 5',
        '2 / 1 / 3 / 5',
        '3 / 1 / 4 / 5',
        '4 / 1 / 5 / 5'
      ],
    },
    {
      id: '4-7',
      wrapStyle: {
        'grid-template-columns': 'repeat(6, 1fr)',
        'grid-template-rows': 'repeat(6, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 3 / 4',
        '3 / 1 / 5 / 4',
        '5 / 1 / 7 / 4',
        '1 / 4 / 7 / 7'
      ],
    },
    {
      id: '4-8',
      wrapStyle: {
        'grid-template-columns': 'repeat(6, 1fr)',
        'grid-template-rows': 'repeat(6, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 7 / 4',
        '1 / 4 / 3 / 7',
        '3 / 4 / 5 / 7',
        '5 / 4 / 7 / 7'
      ],
    },
    {
      id: '4-9',
      wrapStyle: {
        'grid-template-columns': 'repeat(6, 1fr)',
        'grid-template-rows': 'repeat(6, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 4 / 3',
        '1 / 3 / 4 / 5',
        '1 / 5 / 4 / 7',
        '4 / 1 / 7 / 7'
      ],
    },
    {
      id: '4-10',
      wrapStyle: {
        'grid-template-columns': 'repeat(6, 1fr)',
        'grid-template-rows': 'repeat(6, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 4 / 7',
        '4 / 1 / 7 / 3',
        '4 / 3 / 7 / 5',
        '4 / 5 / 7 / 7'
      ],
    },
    {
      id: '4-11',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 3 / 5',
        '3 / 1 / 5 / 3',
        '3 / 3 / 4 / 5',
        '4 / 3 / 5 / 5'
      ],
    },
    {
      id: '4-12',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 5 / 3',
        '1 / 3 / 3 / 4',
        '1 / 4 / 3 / 5',
        '3 / 3 / 5 / 5'
      ],
    },
    {
      id: '4-13',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 3',
        '2 / 1 / 3 / 3',
        '1 / 3 / 3 / 5',
        '3 / 1 / 5 / 5'
      ],
    },
    {
      id: '4-14',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 3 / 3',
        '3 / 1 / 5 / 2',
        '3 / 2 / 5 / 3',
        '1 / 3 / 5 / 5'
      ],
    },
  ],
  5: [
    {
      id: '5-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(3, 1fr)',
        'grid-template-rows': 'repeat(3, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 4 / 2',
        '1 / 2 / 4 / 3',
        '1 / 3 / 2 / 4',
        '2 / 3 / 3 / 4',
        '3 / 3 / 4 / 4'
      ],
    },
    {
      id: '5-2',
      wrapStyle: {
        'grid-template-columns': 'repeat(6, 1fr)',
        'grid-template-rows': 'repeat(6, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 7 / 3',
        '1 / 3 / 4 / 5',
        '4 / 3 / 7 / 5',
        '1 / 5 / 4 / 7',
        '4 / 5 / 7 / 7'
      ],
    }
  ],
  6: [
    {
      id: '6-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(6, 1fr)',
        'grid-template-rows': 'repeat(6, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 4 / 3',
        '1 / 3 / 4 / 5',
        '1 / 5 / 4 / 7',
        '4 / 1 / 7 / 3',
        '4 / 3 / 7 / 5',
        '4 / 5 / 7 / 7'
      ],
    },
    {
      id: '6-2',
      wrapStyle: {
        'grid-template-columns': 'repeat(3, 1fr)',
        'grid-template-rows': 'repeat(3, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 2',
        '1 / 2 / 2 / 3',
        '1 / 3 / 2 / 4',
        '2 / 1 / 3 / 2',
        '3 / 1 / 4 / 2',
        '2 / 2 / 4 / 4'
      ],
    }
  ],
  7: [
    {
      id: '7-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(12, 1fr)',
        'grid-template-rows': 'repeat(12, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 4 / 5',
        '4 / 1 / 7 / 5',
        '1 / 5 / 7 / 9',
        '1 / 9 / 7 / 13',
        '7 / 1 / 13 / 7',
        '7 / 7 / 10 / 13',
        '10 / 7 / 13 / 13'
      ],
    },
    {
      id: '7-2',
      wrapStyle: {
        'grid-template-columns': 'repeat(12, 1fr)',
        'grid-template-rows': 'repeat(12, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 5 / 7',
        '5 / 1 / 9 / 4',
        '5 / 4 / 9 / 7',
        '9 / 1 / 13 / 4',
        '9 / 4 / 13 / 7',
        '1 / 7 / 7 / 13',
        '7 / 7 / 13 / 13'
      ],
    }
  ],
  8: [
    {
      id: '8-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 3 / 2',
        '1 / 2 / 3 / 3',
        '1 / 3 / 3 / 4',
        '1 / 4 / 3 / 5',
        '3 / 1 / 5 / 2',
        '3 / 2 / 5 / 3',
        '3 / 3 / 5 / 4',
        '3 / 4 / 5 / 5'
      ],
    }
  ],
  9: [
    {
      id: '9-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(3, 1fr)',
        'grid-template-rows': 'repeat(3, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 2',
        '1 / 2 / 2 / 3',
        '1 / 3 / 2 / 4',
        '2 / 1 / 3 / 2',
        '2 / 2 / 3 / 3',
        '2 / 3 / 3 / 4',
        '3 / 1 / 4 / 2',
        '3 / 2 / 4 / 3',
        '3 / 3 / 4 / 4'
      ],
    }
  ],
  10: [
    {
      id: '10-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(10, 1fr)',
        'grid-template-rows': 'repeat(10, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 3 / 6',
        '1 / 6 / 3 / 11',
        '3 / 1 / 5 / 6',
        '3 / 6 / 5 / 11',
        '5 / 1 / 7 / 6',
        '5 / 6 / 7 / 11',
        '7 / 1 / 9 / 6',
        '7 / 6 / 9 / 11',
        '9 / 1 / 11 / 6',
        '9 / 6 / 11 / 11'
      ],
    }
  ],
  11: [
    {
      id: '11-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '2 / 2 / 4 / 4',
        '1 / 1 / 2 / 2',
        '1 / 2 / 2 / 4',
        '1 / 4 / 2 / 5',
        '2 / 1 / 3 / 2',
        '3 / 1 / 4 / 2',
        '2 / 4 / 3 / 5',
        '3 / 4 / 4 / 5',
        '4 / 1 / 5 / 2',
        '4 / 2 / 5 / 4',
        '4 / 4 / 5 / 5'
      ],
    }
  ],
  12: [
    {
      id: '12-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(6, 1fr)',
        'grid-template-rows': 'repeat(6, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 4',
        '1 / 4 / 2 / 7',
        '2 / 1 / 3 / 4',
        '2 / 4 / 3 / 7',
        '3 / 1 / 4 / 4',
        '3 / 4 / 4 / 7',
        '4 / 1 / 5 / 4',
        '4 / 4 / 5 / 7',
        '5 / 1 / 6 / 4',
        '5 / 4 / 6 / 7',
        '6 / 1 / 7 / 4',
        '6 / 4 / 7 / 7'
      ],
    }
  ],
  13: [
    {
      id: '13-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 3 / 3',
        '1 / 3 / 2 / 4',
        '1 / 4 / 2 / 5',
        '2 / 3 / 3 / 4',
        '2 / 4 / 3 / 5',
        '3 / 1 / 4 / 2',
        '4 / 1 / 5 / 2',
        '3 / 2 / 4 / 3',
        '4 / 2 / 5 / 3',
        '3 / 3 / 4 / 4',
        '4 / 3 / 5 / 4',
        '3 / 4 / 4 / 5',
        '4 / 4 / 5 / 5'
      ],
    }
  ],
  14: [
    {
      id: '14-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 2',
        '1 / 2 / 2 / 3',
        '1 / 3 / 2 / 4',
        '1 / 4 / 2 / 5',
        '2 / 1 / 3 / 2',
        '3 / 1 / 4 / 2',
        '2 / 2 / 3 / 4',
        '3 / 2 / 4 / 4',
        '2 / 4 / 3 / 5',
        '3 / 4 / 4 / 5',
        '4 / 1 / 5 / 2',
        '4 / 2 / 5 / 3',
        '4 / 3 / 5 / 4',
        '4 / 4 / 5 / 5'
      ],
    }
  ],
  15: [
    {
      id: '15-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 2',
        '1 / 2 / 2 / 3',
        '1 / 3 / 2 / 4',
        '1 / 4 / 2 / 5',
        '2 / 1 / 3 / 2',
        '3 / 1 / 4 / 2',
        '2 / 2 / 3 / 3',
        '2 / 3 / 3 / 4',
        '3 / 2 / 4 / 4',
        '2 / 4 / 3 / 5',
        '3 / 4 / 4 / 5',
        '4 / 1 / 5 / 2',
        '4 / 2 / 5 / 3',
        '4 / 3 / 5 / 4',
        '4 / 4 / 5 / 5'
      ],
    }
  ],
  16: [
    {
      id: '16-1',
      wrapStyle: {
        'grid-template-columns': 'repeat(4, 1fr)',
        'grid-template-rows': 'repeat(4, 1fr)',
      },
      gridAreas: [
        '1 / 1 / 2 / 2',
        '1 / 2 / 2 / 3',
        '1 / 3 / 2 / 4',
        '1 / 4 / 2 / 5',
        '2 / 1 / 3 / 2',
        '3 / 1 / 4 / 2',
        '2 / 2 / 3 / 3',
        '2 / 3 / 3 / 3',
        '2 / 3 / 3 / 4',
        '3 / 2 / 4 / 3',
        '3 / 3 / 4 / 4',
        '2 / 4 / 3 / 5',
        '3 / 4 / 4 / 5',
        '4 / 1 / 5 / 2',
        '4 / 2 / 5 / 3',
        '4 / 3 / 5 / 4',
        '4 / 4 / 5 / 5'
      ],
    }
  ]
};

// 图片数量下拉
export const countOptions = [
  { value: 'all', label: '全部' },
  ...Array.from({ length: 16 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })),
];

/**
 * 解析 CSS Grid Area 模板为百分比坐标
 * 兼容格式如: "1 / 1 / 2 / 2" (rowStart / colStart / rowEnd / colEnd)
 * @param {Object} tpl 模板对象
 */
export const parseTemplateToCells = (tpl) => {
  if (!tpl || !tpl.gridAreas) return [];

  let maxR = 1, maxC = 1;

  const getCountFromStyle = (styleStr) => {
    if (!styleStr) return 1;
    const repeatMatch = styleStr.match(/repeat\((\d+)/);
    if (repeatMatch) return parseInt(repeatMatch[1]);
    const spaceMatch = styleStr.trim().split(/\s+/);
    return spaceMatch.length;
  };

  if (tpl.wrapStyle) {
    maxC = Math.max(maxC, getCountFromStyle(tpl.wrapStyle['grid-template-columns']));
    maxR = Math.max(maxR, getCountFromStyle(tpl.wrapStyle['grid-template-rows']));
  }

  tpl.gridAreas.forEach(area => {
    const parts = area.split('/').map(s => parseInt(s.trim()));
    if (parts.length >= 4) {
      if (parts[2] - 1 > maxR) maxR = parts[2] - 1;
      if (parts[3] - 1 > maxC) maxC = parts[3] - 1;
    }
  });

  return tpl.gridAreas.map((area, index) => {
    const [r1, c1, r2, c2] = area.split('/').map(s => parseInt(s.trim()));
    const x = (c1 - 1) / maxC;
    const y = (r1 - 1) / maxR;
    const w = (c2 - c1) / maxC;
    const h = (r2 - r1) / maxR;

    return { index, x, y, w, h };
  });
};