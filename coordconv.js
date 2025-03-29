let coordconv = function (x, y, fromType, toType) {
    let vCoordConv = {
        init : (x, y) => {
            this.COORD_TM         = 0
            this.COORD_WTM        = 1
            this.COORD_CONGNAMUL  = 2
            this.COORD_WCONGNAMUL = 3
            this.COORD_KTM        = 4
            this.COORD_WKTM       = 5
            this.COORD_UTM        = 6
            this.COORD_WGS84      = 7
            this.COORD_BESSEL     = 8

            this.COORD_BASE = []
            this.COORD_BASE[this.COORD_TM        ] = { name : "TM"        , code : this.COORD_TM        }
            this.COORD_BASE[this.COORD_WTM       ] = { name : "WTM"       , code : this.COORD_WTM       }
            this.COORD_BASE[this.COORD_CONGNAMUL ] = { name : "CONGNAMUL" , code : this.COORD_CONGNAMUL }
            this.COORD_BASE[this.COORD_WCONGNAMUL] = { name : "WCONGNAMUL", code : this.COORD_WCONGNAMUL}
            this.COORD_BASE[this.COORD_KTM       ] = { name : "KTM"       , code : this.COORD_KTM       }
            this.COORD_BASE[this.COORD_WKTM      ] = { name : "WKTM"      , code : this.COORD_WKTM      }
            this.COORD_BASE[this.COORD_UTM       ] = { name : "UTM"       , code : this.COORD_UTM       }
            this.COORD_BASE[this.COORD_WGS84     ] = { name : "WGS84"     , code : this.COORD_WGS84     }
            this.COORD_BASE[this.COORD_BESSEL    ] = { name : "BESSEL"    , code : this.COORD_BESSEL    }
        },

        getTransCoord : (xy, fromType, toType) => {
            if ( fromType == toType ) return xy
            vCoordConv.init(x, y)
            if ( fromType < 0 || fromType >= this.COORD_BASE.length ) return xy
            if ( toType   < 0 || toType   >= this.COORD_BASE.length ) return xy
            let cxy = vCoordConv.convertCoord(xy, fromType, toType)
            return cxy
        },
        convertCoord : (xy, fromType, toType) => {
            let cxy = vCoordConv.from2bassel(xy, fromType) // 1 from to bessel
            return vCoordConv.bassel2to(cxy, toType)     // 2 besell to to
        },
        from2bassel : (xy, fromType) => {
            if ( fromType == this.COORD_TM ) {
                return vCoordConv.convertTM2BESSEL(xy);
            } else if ( fromType == this.COORD_WTM ) {
                let cxy = vCoordConv.convertWTM2WGS(xy);
                return vCoordConv.convertWGS2BESSEL(cxy);
            } else if ( fromType == this.COORD_CONGNAMUL ) {
                return vCoordConv.convertCONG2BESSEL(xy);
            } else if ( fromType == this.COORD_WCONGNAMUL ) {
                let cxy = vCoordConv.convertWCONG2WGS(xy);
                return vCoordConv.convertWGS2BESSEL(cxy);
            } else if ( fromType == this.COORD_KTM ) {
                return vCoordConv.convertKTM2BESSEL(xy);
            } else if ( fromType == this.COORD_WKTM ) {
                let cxy = vCoordConv.convertWKTM2WGS(xy);
                return vCoordConv.convertWGS2BESSEL(cxy);
            } else if ( fromType == this.COORD_UTM ) {
                let cxy = vCoordConv.convertUTM2WGS(xy);
                return vCoordConv.convertWGS2BESSEL(cxy);
            } else if ( fromType == this.COORD_WGS84 ) {
                return vCoordConv.convertWGS2BESSEL(xy);
            } else if ( fromType == this.COORD_BESSEL ) {
                return xy
            }
        },
        bassel2to : (xy, toType) => {
            if ( toType == this.COORD_TM ) {
                return vCoordConv.convertBESSEL2TM(xy);
            } else if ( toType == this.COORD_WTM ) {
                let cxy = vCoordConv.convertBESSEL2WGS(xy);
                return vCoordConv.convertWGS2WTM(cxy);
            } else if ( toType == this.COORD_CONGNAMUL ) {
                return vCoordConv.convertBESSEL2CONG(xy);
            } else if ( toType == this.COORD_WCONGNAMUL ) {
                let cxy = vCoordConv.convertBESSEL2WGS(xy);
                return vCoordConv.convertWGS2WCONG(cxy);
            } else if ( toType == this.COORD_KTM ) {
                return vCoordConv.convertBESSEL2KTM(xy);
            } else if ( toType == this.COORD_WKTM ) {
                let cxy = vCoordConv.convertBESSEL2WGS(xy);
                return vCoordConv.convertWGS2WKTM(cxy);
            } else if ( toType == this.COORD_UTM ) {
                let cxy = vCoordConv.convertBESSEL2WGS(xy);
                return vCoordConv.convertWGS2UTM(cxy);
            } else if ( toType == this.COORD_WGS84 ) {
                return vCoordConv.convertBESSEL2WGS(xy);
            } else if ( toType == this.COORD_BESSEL ) {
                // 이것에 bassel?
                return xy
            }
        },
        convertBESSEL2KTM : xy => {
            return vCoordConv.GP2TM(xy, 6377397.155, 0.0033427731799399794, 600000, 400000, 0.9999, 38, 128);
        },
        convertBESSEL2CONG : xy => {
            let cxy = vCoordConv.GP2TM(xy, 6377397.155, 0.0033427731799399794, 500000, 200000, 1, 38, 127.00289027777778);
            return vCoordConv.shiftIsland(cxy, true);
        },
        convertBESSEL2WGS : xy => {
            return vCoordConv.GP2WGP(xy, 0, 6377397.155, 0.0033427731799399794);
        },
        convertKTM2BESSEL : xy => {
            return vCoordConv.TM2GP(xy, 6377397.155, 0.0033427731799399794, 600000, 400000, 0.9999, 38, 128);
        },
        convertBESSEL2TM : xy => {
            return vCoordConv.GP2TM(xy, 6377397.155, 0.0033427731799399794, 500000, 200000, 1, 38, 127.0028902777777777776);
        },
        convertTM2BESSEL : xy => {
            return vCoordConv.TM2GP(xy, 6377397.155, 0.0033427731799399794, 500000, 200000, 1, 38, 127.0028902777777777776);
        },
        convertWGS2UTM : xy => {
            return vCoordConv.GP2TM(xy, 6378137, 0.0033528106647474805, 0, 500000, 0.9996, 0, 129);
        },
        convertWGS2WTM : xy => {
            return vCoordConv.GP2TM(xy, 6378137, 0.0033528106647474805, 500000, 200000, 1, 38, 127);
        },
        convertWGS2WKTM : xy => {
            return vCoordConv.GP2TM(xy, 6378137, 0.0033528106647474805, 600000, 400000, 0.9999, 38, 128);
        },
        convertWGS2WCONG : xy => {
            let cxy = vCoordConv.GP2TM(xy, 6378137, 0.0033528106647474805, 500000, 200000, 1, 38, 127);
            return [ Math.round(cxy[0] * 2.5), Math.round(cxy[1] * 2.5) ];
        },
        convertUTM2WGS : xy => {
            return vCoordConv.TM2GP(xy, 6378137, 0.0033528106647474805, 0, 500000, 0.9996, 0, 129);
        },
        convertWGS2BESSEL : xy => {
            return vCoordConv.WGP2GP(xy, 0, 6377397.155, 0.0033427731799399794);
        },
        convertCONG2BESSEL : xy => {
            let cxy = vCoordConv.shiftIsland(xy, false);
            return vCoordConv.TM2GP(cxy, 6377397.155, 0.0033427731799399794, 500000, 200000, 1, 38, 127.00289027777778);
        },
        convertWTM2WGS : xy => { 
            return vCoordConv.TM2GP(xy, 6378137, 0.0033528106647474805, 500000, 200000, 1, 38, 127);
        },
        convertWKTM2WGS : xy => {
            return vCoordConv.TM2GP(xy, 6378137, 0.0033528106647474805, 600000, 400000, 0.9999, 38, 128);
        },
        convertWCONG2WGS : xy => {
            xy = [ xy[0] / 2.5, xy[1] / 2.5 ];
            return vCoordConv.TM2GP(xy, 6378137, 0.0033528106647474805, 500000, 200000, 1, 38, 127);
        },
        WGP2GP : (xy, d, e, h) => {
            let rtn = vCoordConv.WGP2WCTR(xy, d);
            rtn = vCoordConv.TransMolod(rtn[0], rtn[1], rtn[2]);
            return vCoordConv.CTR2GP(rtn[0], rtn[1], rtn[2], e, h);
        },
        WGP2WCTR : (xy, d) => {
            return vCoordConv.GP2CTR(xy, d, 6378137, 0.0033528106647474805);
        },
        GP2WGP : (xy, d, e, h) => {
            let rtn = vCoordConv.GP2CTR(xy, d, e, h);
            rtn = vCoordConv.InverseMolod(rtn[0], rtn[1], rtn[2]);
            return vCoordConv.WCTR2WGP(rtn[0], rtn[1], rtn[2]);
        },
        GP2CTR : ( xy, d, e, h) => {
            let a = xy[1]
            let b = xy[0]
            let c = Math.atan(1) / 45
            let m = h;
            if ( m > 1 ) m = 1 / m;
            let l = a * c;
            c *= b;
            m = 1 / m;
            m = e * (m - 1) / m;
            let o = (Math.pow(e, 2) - Math.pow(m, 2)) / Math.pow(e, 2);
            o = e / Math.sqrt(1 - o * Math.pow(Math.sin(l), 2));

            return  [ (o + d) * Math.cos(l) * Math.cos(c)
                    , (o + d) * Math.cos(l) * Math.sin(c)
                    , (Math.pow(m, 2) / Math.pow(e, 2) * o + d) * Math.sin(l) ]
        },
        InverseMolod : ( a, b, d ) => {
            const m = Math.atan(1) / 45;
            let m_dx = 115.8;
            let m_dy = -474.99;
            let m_dz = -674.11;
            let m_omega = 1.16 / 3600 * m;
            let m_phi = -2.31 / 3600 * m;
            let m_kappa = -1.63 / 3600 * m; 
            let m_ds = -6.43 * 1.0E-6;

            let e = (a - m_dx) * (1 + m_ds);
            let h = (b - m_dy) * (1 + m_ds);
            let c = (d - m_dz) * (1 + m_ds);
            return [ 1 / (1 + m_ds) * (e - m_kappa * h + m_phi * c)
                   , 1 / (1 + m_ds) * (m_kappa * e + h - m_omega * c)
                   , 1 / (1 + m_ds) * (-1 * m_phi * e + m_omega * h + c) ]
        },
        TransMolod : ( a, b, d ) => {
            const m = Math.atan(1) / 45;
            let m_dx = 115.8;
            let m_dy = -474.99;
            let m_dz = -674.11;
            let m_omega = 1.16 / 3600 * m;
            let m_phi = -2.31 / 3600 * m;
            let m_kappa = -1.63 / 3600 * m; 
            let m_ds = -6.43 * 1.0E-6;

            return [ a + (1 + m_ds) * (m_kappa * b - m_phi * d) + m_dx
                   , b + (1 + m_ds) * (-1 * m_kappa * a + m_omega * d) + m_dy
                   , d + (1 + m_ds) * (m_phi * a - m_omega * b) + m_dz ]
        },
        WCTR2WGP : ( a, b, d ) => {
            return vCoordConv.CTR2GP(a, b, d, 6378137, 0.0033528106647474805);
        },
        CTR2GP : ( a, b, d, e, h ) => {
            let m = h;
            if ( m > 1 ) m = 1 / m;
            let c = Math.atan(1) / 45
            m = 1 / m;
            let o = e * (m - 1) / m;
            let D = (Math.pow(e, 2) - Math.pow(o, 2)) / Math.pow(e, 2);
            m = Math.atan(b / a);
            let A = Math.sqrt(a * a + b * b);
            let u = e;
            let l = 0, f = 0, bb = 0, w = 0;
            do {
                ++bb;
                w = Math.pow(Math.pow(o, 2) / Math.pow(e, 2) * u + w, 2) - Math.pow(d, 2);
                w = d / Math.sqrt(w);
                l = Math.atan(w);
                if ( Math.abs(l - f) < 1.0E-18) {
                    break;
                }
                u = e / Math.sqrt(1 - D * Math.pow(Math.sin(l), 2));
                w = A / Math.cos(l) - u;
                f = l;
            } while (bb <= 30);

            let rtn = [ m / c, l / c ];
            if ( a < 0 ) rtn[0] += 180
            if ( rtn[0] < 0 ) rtn[0] += 360
            return rtn
        },
        GP2TM : (xy, d, e, h, f, c, l, m) => {
            let a = xy[1]
            let b = xy[0]
            let B = f;
            let w = e;
            if ( w > 1 ) w = 1 / w;
            let A = Math.atan(1) / 45
            let o = a * A;
            let D = b * A;
            let u = l * A;
            A *= m;
            w = 1 / w;
            let z = d * (w - 1) / w;
            let G = (Math.pow(d, 2) - Math.pow(z, 2)) / Math.pow(d, 2);
            w = (Math.pow(d, 2) - Math.pow(z, 2)) / Math.pow(z, 2);
            z = (d - z) / (d + z);
            let E = d * (1 - z + 5 * (Math.pow(z, 2) - Math.pow(z, 3)) / 4 + 81 * (Math.pow(z, 4) - Math.pow(z, 5)) / 64);
            let I = 3 * d * (z - Math.pow(z, 2) + 7 * (Math.pow(z, 3) - Math.pow(z, 4)) / 8 + 55 * Math.pow(z, 5) / 64) / 2
            let J = 15 * d * (Math.pow(z, 2) - Math.pow(z, 3) + 3 * (Math.pow(z, 4) - Math.pow(z, 5)) / 4) / 16
            let L = 35 * d * (Math.pow(z, 3) - Math.pow(z, 4) + 11 * Math.pow(z, 5) / 16) / 48
            let M = 315 * d * (Math.pow(z, 4) - Math.pow(z, 5)) / 512
            D -= A;
            u = E * u - I * Math.sin(2 * u) + J * Math.sin(4 * u) - L * Math.sin(6 * u) + M * Math.sin(8 * u);
            z = u * c;
            let H = Math.sin(o);
            u = Math.cos(o);
            A = H / u;
            w *= Math.pow(u, 2);
            G = d / Math.sqrt(1 - G * Math.pow(Math.sin(o), 2));
            o = E * o - I * Math.sin(2 * o) + J * Math.sin(4 * o) - L * Math.sin(6 * o) + M * Math.sin(8 * o);
            o *= c;
            E = G * H * u * c / 2
            I = G * H * Math.pow(u, 3) * c * (5 - Math.pow(A, 2) + 9 * w + 4 * Math.pow(w, 2)) / 24
            J = G * H * Math.pow(u, 5) * c * (61 - 58 * Math.pow(A, 2) + Math.pow(A, 4) + 270 * w - 330 * Math.pow(A, 2) * w + 445 * Math.pow(w, 2) + 324 * Math.pow(w, 3) - 680 * Math.pow(A, 2) * Math.pow(w, 2) + 88 * Math.pow(w, 4) - 600 * Math.pow(A, 2) * Math.pow(w, 3) - 192 * Math.pow(A, 2) * Math.pow(w, 4)) / 720
            H = G * H * Math.pow(u, 7) * c * (1385 - 3111 * Math.pow(A, 2) + 543 * Math.pow(A, 4) - Math.pow(A, 6)) / 40320
            o = o + Math.pow(D, 2) * E + Math.pow(D, 4) * I + Math.pow(D, 6) * J + Math.pow(D, 8) * H;
            let y = o - z + h;
            o = G * u * c;
            z = G * Math.pow(u, 3) * c * (1 - Math.pow(A, 2) + w) / 6
            w = G * Math.pow(u, 5) * c * (5 - 18 * Math.pow(A, 2) + Math.pow(A, 4) + 14 * w - 58 * Math.pow(A, 2) * w + 13 * Math.pow(w, 2) + 4 * Math.pow(w, 3) - 64 * Math.pow(A, 2) * Math.pow(w, 2) - 25 * Math.pow(A, 2) * Math.pow(w, 3)) / 120
            u = G * Math.pow(u, 7) * c * (61 - 479 * Math.pow(A, 2) + 179 * Math.pow(A, 4) - Math.pow(A, 6)) / 5040
            let x = B + D * o + Math.pow(D, 3) * z + Math.pow(D, 5) * w + Math.pow(D, 7) * u;
            return [ x, y ];
        },
        TM2GP : ( xy, d, e, h, f, c, l, m) => {
            let u = e;
            let a = xy[1]
            let b = xy[0]
            if ( u > 1 ) u = 1 / u;
            let A = f;
            let w = Math.atan(1) / 45
            let o = l * w;
            let D = m * w;
            u = 1 / u;
            let B = d * (u - 1) / u;
            let z = (Math.pow(d, 2) - Math.pow(B, 2)) / Math.pow(d, 2);
            u = (Math.pow(d, 2) - Math.pow(B, 2)) / Math.pow(B, 2);
            B = (d - B) / (d + B);
            let G = d * (1 - B + 5 * (Math.pow(B, 2) - Math.pow(B, 3)) / 4 + 81 * (Math.pow(B, 4) - Math.pow(B, 5)) / 64);
            let E = 3 * d * (B - Math.pow(B, 2) + 7 * (Math.pow(B, 3) - Math.pow(B, 4)) / 8 + 55 * Math.pow(B, 5) / 64) / 2
            let I = 15 * d * (Math.pow(B, 2) - Math.pow(B, 3) + 3 * (Math.pow(B, 4) - Math.pow(B, 5)) / 4) / 16
            let J = 35 * d * (Math.pow(B, 3) - Math.pow(B, 4) + 11 * Math.pow(B, 5) / 16) / 48
            let L = 315 * d * (Math.pow(B, 4) - Math.pow(B, 5)) / 512
            o = G * o - E * Math.sin(2 * o) + I * Math.sin(4 * o) - J * Math.sin(6 * o) + L * Math.sin(8 * o);
            o *= c;
            o = a + o - h;
            let M = o / c;
            let H = d * (1 - z) / Math.pow(Math.sqrt(1 - z * Math.pow(Math.sin(0), 2)), 3);
            o = M / H;
            for (a = 1; a <= 5; ++a) {
                B = G * o - E * Math.sin(2 * o) + I * Math.sin(4 * o) - J * Math.sin(6 * o) + L * Math.sin(8 * o);
                H = d * (1 - z) / Math.pow(Math.sqrt(1 - z * Math.pow(Math.sin(o), 2)), 3);
                o += (M - B) / H;
            }
            H = d * (1 - z) / Math.pow(Math.sqrt(1 - z * Math.pow(Math.sin(o), 2)), 3);
            G = d / Math.sqrt(1 - z * Math.pow(Math.sin(o), 2));
            B = Math.sin(o);
            z = Math.cos(o);
            E = B / z;
            u *= Math.pow(z, 2);
            A = b - A;
            B = E / (2 * H * G * Math.pow(c, 2));
            I = E * (5 + 3 * Math.pow(E, 2) + u - 4 * Math.pow(u, 2) - 9 * Math.pow(E, 2) * u) / (24 * H * Math.pow(G, 3) * Math.pow(c, 4));
            J = E * (61 + 90 * Math.pow(E, 2) + 46 * u + 45 * Math.pow(E, 4) - 252 * Math.pow(E, 2) * u - 3 * Math.pow(u, 2) + 100 * Math.pow(u, 3) - 66 * Math.pow(E, 2) * Math.pow(u, 2) - 90 * Math.pow(E, 4) * u + 88 * Math.pow(u, 4) + 225 * Math.pow(E, 4) * Math.pow(u, 2) + 84 * Math.pow(E, 2) * Math.pow(u, 3) - 192 * Math.pow(E, 2) * Math.pow(u, 4)) / (720 * H * Math.pow(G, 5) * Math.pow(c, 6));
            H = E * (1385 + 3633 * Math.pow(E, 2) + 4095 * Math.pow(E, 4) + 1575 * Math.pow(E, 6)) / (40320 * H * Math.pow(G, 7) * Math.pow(c, 8));
            o = o - Math.pow(A, 2) * B + Math.pow(A, 4) * I - Math.pow(A, 6) * J + Math.pow(A, 8) * H;
            B = 1 / (G * z * c);
            H = (1 + 2 * Math.pow(E, 2) + u) / (6 * Math.pow(G, 3) * z * Math.pow(c, 3));
            u = (5 + 6 * u + 28 * Math.pow(E, 2) - 3 * Math.pow(u, 2) + 8 * Math.pow(E, 2) * u + 24 * Math.pow(E, 4) - 4 * Math.pow(u, 3) + 4 * Math.pow(E, 2) * Math.pow(u, 2) + 24 * Math.pow(E, 2) * Math.pow(u, 3)) / (120 * Math.pow(G, 5) * z * Math.pow(c, 5));
            z = (61 + 662 * Math.pow(E, 2) + 1320 * Math.pow(E, 4) + 720 * Math.pow(E, 6)) / (5040 * Math.pow(G, 7) * z * Math.pow(c, 7));
            A = A * B - Math.pow(A, 3) * H + Math.pow(A, 5) * u - Math.pow(A, 7) * z;
            D += A;
            return [ D / w , o / w]
        },
        shiftIsland : (xy, pTF) => {
            let x, y
            let rectArray1  = [ { x : 112500, y : -50000, w : 33500, h : 53000 },
                                { x : 146000, y : -50000, w : 54000, h : 58600 },
                                { x : 130000, y :  44000, w : 15000, h : 14000 },
                                { x : 532500, y : 437500, w : 25000, h : 25000 },
                                { x : 625000, y : 412500, w : 25000, h : 25000 },
                                { x : -12500, y : 462500, w : 17500, h : 50000 } ]
            if ( pTF ) {
                let e = 0, h = 0
                let deltaValue1 = [ [ 0,  50000 ], [ 0,  50000 ], [ 0,  10000 ], [ -70378, -136 ], [ -144738, -2161 ], [  23510, -111 ] ]
                for ( var i = 0; i < rectArray1.length; ++i ) {
                    if ( xy[0] - rectArray1[i].x >= 0 && xy[0] - rectArray1[i].x <= rectArray1[i].w
                      && xy[1] - rectArray1[i].y >= 0 && xy[1] - rectArray1[i].y <= rectArray1[i].h ) {
                        e += deltaValue1[i][0];
                        h += deltaValue1[i][1];
                        break;
                    }
                }
                x = (xy[0] + e) * 2.5 + 0.5
                y = (xy[1] + h) * 2.5 + 0.5
            } else {
                x = xy[0] / 2.5;
                y = xy[1] / 2.5;
                let deltaValue2 = [ [ 0, -50000 ], [ 0, -50000 ], [ 0, -10000 ], [  70378,  136 ], [  144738,  2161 ], [ -23510,  111 ] ]
                for ( var i = 0; i < rectArray1.length; ++i ) {
                    if ( x - rectArray1[i].x >= 0 && x - rectArray1[i].x <= rectArray1[i].w
                      && y - rectArray1[i].y >= 0 && y - rectArray1[i].y <= rectArray1[i].h ) {
                        x += deltaValue2[i][0];
                        y += deltaValue2[i][1];
                        break;
                    }
                }
            }
            return [x,y]
        }
    }
    return vCoordConv.getTransCoord([x, y], fromType, toType)
}
try{module.exports = coordconv} catch(e){}
