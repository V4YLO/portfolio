(function (global) {
  var CASE_FILES = [
    {
      id: '00-000A',
      tabLabel: '00-000A',
      leftFrontTitle: 'CONFIDENTIAL',
      leftBackTitle: 'FBI Case File',
      leftBackPath: 'cases/00-000A/left_page.html',
      leftBackPathCz: 'cases/00-000A/cz/left_page.html',
      folderTheme: { front: '#1a1a1a', frontLight: '#2d2d2d', frontDark: '#0d0d0d', spine: '#1a1a1a', spineLight: '#2d2d2d', spineDark: '#0d0d0d', stamp: '#c91717', stampBorder: '#a01010', tabText: '#fff' },
      pages: [
        { frontPath: 'cases/00-000A/page_1_front.html', backPath: 'cases/00-000A/page_1_back.html', frontPathCz: 'cases/00-000A/cz/page_1_front.html', backPathCz: 'cases/00-000A/cz/page_1_back.html' },
        { frontPath: 'cases/00-000A/page_2_front.html', backPath: 'cases/00-000A/page_2_back.html', frontPathCz: 'cases/00-000A/cz/page_2_front.html', backPathCz: 'cases/00-000A/cz/page_2_back.html' },
        { frontPath: 'cases/00-000A/page_3_front.html', backPath: 'cases/00-000A/page_3_back.html', frontPathCz: 'cases/00-000A/cz/page_3_front.html', backPathCz: 'cases/00-000A/cz/page_3_back.html' },
        { frontPath: 'cases/00-000A/page_4_front.html', backPath: 'cases/00-000A/page_4_back.html', frontPathCz: 'cases/00-000A/cz/page_4_front.html', backPathCz: 'cases/00-000A/cz/page_4_back.html' },
        { frontPath: 'cases/00-000A/page_5_front.html', backPath: 'cases/00-000A/page_5_back.html', frontPathCz: 'cases/00-000A/cz/page_5_front.html', backPathCz: 'cases/00-000A/cz/page_5_back.html' },
        { frontPath: 'cases/00-000A/page_6_front.html', backPath: 'cases/00-000A/page_6_back.html', frontPathCz: 'cases/00-000A/cz/page_6_front.html', backPathCz: 'cases/00-000A/cz/page_6_back.html' },
        { frontPath: 'cases/00-000A/page_7_front.html', backPath: 'cases/00-000A/page_7_back.html', frontPathCz: 'cases/00-000A/cz/page_7_front.html', backPathCz: 'cases/00-000A/cz/page_7_back.html' }
      ]
    },
    {
      id: '01-001D',
      tabLabel: '01-001D',
      leftFrontTitle: '',
      noStamp: true,
      leftBackTitle: 'UNIT Archive',
      leftBackPath: 'cases/01-001D/left_page.html',
      folderTheme: { front: '#1e3a5f', frontLight: '#2a4a7a', frontDark: '#152a47', spine: '#1e3a5f', spineLight: '#2a4a7a', spineDark: '#152a47', tabText: '#fff' },
      pages: [
        { frontPath: 'cases/01-001D/page_1_front.html', backPath: 'cases/01-001D/page_1_back.html' },
        { frontPath: 'cases/01-001D/page_2_front.html', backPath: 'cases/01-001D/page_2_back.html' },
        { frontPath: 'cases/01-001D/page_3_front.html', backPath: 'cases/01-001D/page_3_back.html' },
        { frontPath: 'cases/01-001D/page_4_front.html', backPath: 'cases/01-001D/page_4_back.html' }
      ]
    },
    {
      id: '02-002X',
      tabLabel: '02-002X',
      leftFrontTitle: '',
      noStamp: true,
      leftBackTitle: 'FBI — X-Files Division',
      leftBackPath: 'cases/02-002X/left_page.html',
      folderTheme: { front: '#1e4d2e', frontLight: '#2d6b3d', frontDark: '#143a20', spine: '#1e4d2e', spineLight: '#2d6b3d', spineDark: '#143a20', tabText: '#fff' },
      pages: [
        { frontPath: 'cases/02-002X/page_1_front.html', backPath: 'cases/02-002X/page_1_back.html' },
        { frontPath: 'cases/02-002X/page_2_front.html', backPath: 'cases/02-002X/page_2_back.html' },
        { frontPath: 'cases/02-002X/page_3_front.html', backPath: 'cases/02-002X/page_3_back.html' },
        { frontPath: 'cases/02-002X/page_4_front.html', backPath: 'cases/02-002X/page_4_back.html' }
      ]
    },
    {
      id: '03-003T',
      tabLabel: '03-003T',
      leftFrontTitle: 'X-FILE',
      leftBackTitle: 'FBI — Twin Peaks',
      leftBackPath: 'cases/03-003T/left_page.html',
      folderTheme: { front: '#a68058', frontLight: '#b8926a', frontDark: '#8f6b40', spine: '#a68058', spineLight: '#b8926a', spineDark: '#8f6b40', stamp: '#c91717', stampBorder: '#a01010', tabText: '#1a1a1a' },
      pages: [
        { frontPath: 'cases/03-003T/page_1_front.html', backPath: 'cases/03-003T/page_1_back.html' },
        { frontPath: 'cases/03-003T/page_2_front.html', backPath: 'cases/03-003T/page_2_back.html' },
        { frontPath: 'cases/03-003T/page_3_front.html', backPath: 'cases/03-003T/page_3_back.html' }
      ]
    },
    {
      id: '04-004S',
      tabLabel: '04-004S',
      leftFrontTitle: '',
      noStamp: true,
      leftBackTitle: 'Hawkins Lab — Classified',
      leftBackPath: 'cases/04-004S/left_page.html',
      pages: [
        { frontPath: 'cases/04-004S/page_1_front.html', backPath: 'cases/04-004S/page_1_back.html' },
        { frontPath: 'cases/04-004S/page_2_front.html', backPath: 'cases/04-004S/page_2_back.html' },
        { frontPath: 'cases/04-004S/page_3_front.html', backPath: 'cases/04-004S/page_3_back.html' }
      ]
    },
    {
      id: '05-005I',
      tabLabel: '05-005I',
      leftFrontTitle: '',
      noStamp: true,
      leftBackTitle: 'Derry — Unexplained',
      leftBackPath: 'cases/05-005I/left_page.html',
      pages: [
        { frontPath: 'cases/05-005I/page_1_front.html', backPath: 'cases/05-005I/page_1_back.html' },
        { frontPath: 'cases/05-005I/page_2_front.html', backPath: 'cases/05-005I/page_2_back.html' },
        { frontPath: 'cases/05-005I/page_3_front.html', backPath: 'cases/05-005I/page_3_back.html' }
      ]
    },
    {
      id: '06-006B',
      tabLabel: '06-006B',
      leftFrontTitle: '',
      noStamp: true,
      leftBackTitle: 'Black Lodge — File',
      leftBackPath: 'cases/06-006B/left_page.html',
      pages: [
        { frontPath: 'cases/06-006B/page_1_front.html', backPath: 'cases/06-006B/page_1_back.html' },
        { frontPath: 'cases/06-006B/page_2_front.html', backPath: 'cases/06-006B/page_2_back.html' }
      ]
    },
    {
      id: '07-007M',
      tabLabel: '07-007M',
      leftFrontTitle: '',
      noStamp: true,
      leftBackTitle: 'Millbrook — Project',
      leftBackPath: 'cases/07-007M/left_page.html',
      pages: [
        { frontPath: 'cases/07-007M/page_1_front.html', backPath: 'cases/07-007M/page_1_back.html' },
        { frontPath: 'cases/07-007M/page_2_front.html', backPath: 'cases/07-007M/page_2_back.html' },
        { frontPath: 'cases/07-007M/page_3_front.html', backPath: 'cases/07-007M/page_3_back.html' }
      ]
    }
  ];

  function getCaseById(id) {
    for (var i = 0; i < CASE_FILES.length; i++) {
      if (CASE_FILES[i].id === id) return CASE_FILES[i];
    }
    return null;
  }

  global.CASE_FILES = CASE_FILES;
  global.getCaseById = getCaseById;
})(typeof window !== 'undefined' ? window : this);
