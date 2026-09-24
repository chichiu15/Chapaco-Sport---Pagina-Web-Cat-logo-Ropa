export const datosCatalogoPrueba = {
  categorias: {
    compresion: {
      descripcion: "Prendas deportivas ajustadas para entrenamiento y gimnasio.",
      estado: "activo",
      nombre: "Compresión"
    },
    camisetas: {
      descripcion: "Camisetas deportivas y urbanas para hombre.",
      estado: "activo",
      nombre: "Camisetas"
    },
    shorts: {
      descripcion: "Shorts deportivos para gimnasio y uso diario.",
      estado: "activo",
      nombre: "Shorts"
    },
    buzos: {
      descripcion: "Buzos y hoodies deportivos de estilo urbano.",
      estado: "activo",
      nombre: "Buzos"
    },
    pantalones: {
      descripcion: "Pantalones deportivos, joggers y cargos.",
      estado: "activo",
      nombre: "Pantalones"
    },
    chaquetas: {
      descripcion: "Chaquetas deportivas y urbanas para hombre.",
      estado: "activo",
      nombre: "Chaquetas"
    },
    accesorios: {
      descripcion: "Accesorios deportivos para complementar el outfit.",
      estado: "activo",
      nombre: "Accesorios"
    }
  },

  marcas: {
    gymshark: {
      estado: "activo",
      nombre: "Gymshark"
    },
    youngla: {
      estado: "activo",
      nombre: "YoungLA"
    },
    ufc: {
      estado: "activo",
      nombre: "UFC"
    },
    onix: {
      estado: "activo",
      nombre: "Onix"
    },
    zip: {
      estado: "activo",
      nombre: "Zip"
    },
    nike: {
      estado: "activo",
      nombre: "Nike"
    },
    adidas: {
      estado: "activo",
      nombre: "Adidas"
    }
  },

  productos: {
    "prod001": {
      categoria_id: "compresion",
      descripcion_corta: "Remera de compresión deportiva de ajuste ceñido, tela elástica y transpirable. Ideal para gimnasio y entrenamiento intenso.",
      es_nuevo: true,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "gymshark",
      nombre: "V1 COMPRESION",
      precio: 250,
      subcolecciones: {
        variantes: {
          "p001mneg": {
            cod_producto: "V1-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: 200,
            talla: "M"
          },
          "p001lneg": {
            cod_producto: "V1-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: 200,
            talla: "L"
          },
          "p001xlneg": {
            cod_producto: "V1-NEG-XL",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: 200,
            talla: "XL"
          },
          "p001mplo": {
            cod_producto: "V1-PLO-M",
            color_estampado: "Plomo",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - PLOMO",
            precio_oferta: 200,
            talla: "M"
          },
          "p001lplo": {
            cod_producto: "V1-PLO-L",
            color_estampado: "Plomo",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - PLOMO",
            precio_oferta: 200,
            talla: "L"
          },
          "p001xlplo": {
            cod_producto: "V1-PLO-XL",
            color_estampado: "Plomo",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - PLOMO",
            precio_oferta: 200,
            talla: "XL"
          },
          "p001mazu": {
            cod_producto: "V1-AZU-M",
            color_estampado: "Azul",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - AZUL",
            precio_oferta: 200,
            talla: "M"
          },
          "p001lazu": {
            cod_producto: "V1-AZU-L",
            color_estampado: "Azul",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - AZUL",
            precio_oferta: 200,
            talla: "L"
          },
          "p001xlazu": {
            cod_producto: "V1-AZU-XL",
            color_estampado: "Azul",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - AZUL",
            precio_oferta: 200,
            talla: "XL"
          }
        }
      }
    },

    "prod002": {
      categoria_id: "camisetas",
      descripcion_corta: "Camiseta deportiva oversize de manga corta, cómoda y ligera para entrenamiento o uso casual.",
      es_nuevo: true,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "onix",
      nombre: "ONIX MANGA CORTA",
      precio: 250,
      subcolecciones: {
        variantes: {
          "p002mneg": {
            cod_producto: "ONIX-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: null,
            talla: "M"
          },
          "p002lneg": {
            cod_producto: "ONIX-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: null,
            talla: "L"
          },
          "p002xlneg": {
            cod_producto: "ONIX-NEG-XL",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: null,
            talla: "XL"
          },
          "p002mroj": {
            cod_producto: "ONIX-ROJ-M",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - ROJO",
            precio_oferta: null,
            talla: "M"
          },
          "p002lroj": {
            cod_producto: "ONIX-ROJ-L",
            color_estampado: "Rojo",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA L - ROJO",
            precio_oferta: null,
            talla: "L"
          },
          "p002xlroj": {
            cod_producto: "ONIX-ROJ-XL",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - ROJO",
            precio_oferta: null,
            talla: "XL"
          },
          "p002mbla": {
            cod_producto: "ONIX-BLA-M",
            color_estampado: "Blanco",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - BLANCO",
            precio_oferta: null,
            talla: "M"
          },
          "p002lbla": {
            cod_producto: "ONIX-BLA-L",
            color_estampado: "Blanco",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - BLANCO",
            precio_oferta: null,
            talla: "L"
          },
          "p002xlbla": {
            cod_producto: "ONIX-BLA-XL",
            color_estampado: "Blanco",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA XL - BLANCO",
            precio_oferta: null,
            talla: "XL"
          }
        }
      }
    },

    "prod003": {
      categoria_id: "buzos",
      descripcion_corta: "Hoodie oversize de estilo urbano, tela gruesa y cómoda con interior suave.",
      es_nuevo: false,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "zip",
      nombre: "ZIP CHAOS HOODIE",
      precio: 350,
      subcolecciones: {
        variantes: {
          "p003mneg": {
            cod_producto: "ZIP-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: 299,
            talla: "M"
          },
          "p003lneg": {
            cod_producto: "ZIP-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: 299,
            talla: "L"
          },
          "p003xlneg": {
            cod_producto: "ZIP-NEG-XL",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: 299,
            talla: "XL"
          },
          "p003mgri": {
            cod_producto: "ZIP-GRI-M",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - GRIS",
            precio_oferta: 299,
            talla: "M"
          },
          "p003lgri": {
            cod_producto: "ZIP-GRI-L",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - GRIS",
            precio_oferta: 299,
            talla: "L"
          },
          "p003xlgri": {
            cod_producto: "ZIP-GRI-XL",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - GRIS",
            precio_oferta: 299,
            talla: "XL"
          },
          "p003mcre": {
            cod_producto: "ZIP-CRE-M",
            color_estampado: "Crema",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - CREMA",
            precio_oferta: 299,
            talla: "M"
          },
          "p003lcre": {
            cod_producto: "ZIP-CRE-L",
            color_estampado: "Crema",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - CREMA",
            precio_oferta: 299,
            talla: "L"
          },
          "p003xlcre": {
            cod_producto: "ZIP-CRE-XL",
            color_estampado: "Crema",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - CREMA",
            precio_oferta: 299,
            talla: "XL"
          }
        }
      }
    },

    "prod004": {
      categoria_id: "camisetas",
      descripcion_corta: "Jersey UFC oversize con estilo MMA y streetwear, tela fresca y ligera.",
      es_nuevo: false,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "ufc",
      nombre: "JERSEY UFC 98",
      precio: 200,
      subcolecciones: {
        variantes: {
          "p004mplo": {
            cod_producto: "UFC98-PLO-M",
            color_estampado: "Plomo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - PLOMO",
            precio_oferta: null,
            talla: "M"
          },
          "p004lplo": {
            cod_producto: "UFC98-PLO-L",
            color_estampado: "Plomo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - PLOMO",
            precio_oferta: null,
            talla: "L"
          },
          "p004xlplo": {
            cod_producto: "UFC98-PLO-XL",
            color_estampado: "Plomo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - PLOMO",
            precio_oferta: null,
            talla: "XL"
          },
          "p004mneg": {
            cod_producto: "UFC98-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: null,
            talla: "M"
          },
          "p004lneg": {
            cod_producto: "UFC98-NEG-L",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: null,
            talla: "L"
          },
          "p004xlneg": {
            cod_producto: "UFC98-NEG-XL",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: null,
            talla: "XL"
          },
          "p004mroj": {
            cod_producto: "UFC98-ROJ-M",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - ROJO",
            precio_oferta: null,
            talla: "M"
          },
          "p004lroj": {
            cod_producto: "UFC98-ROJ-L",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - ROJO",
            precio_oferta: null,
            talla: "L"
          },
          "p004xlroj": {
            cod_producto: "UFC98-ROJ-XL",
            color_estampado: "Rojo",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA XL - ROJO",
            precio_oferta: null,
            talla: "XL"
          }
        }
      }
    },

    "prod005": {
      categoria_id: "pantalones",
      descripcion_corta: "Pantalón cargo de estilo urbano con bolsillos laterales y corte relajado.",
      es_nuevo: true,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517438476312-10d79c077509?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "youngla",
      nombre: "CARGO BATMAN",
      precio: 500,
      subcolecciones: {
        variantes: {
          "p005mneg": {
            cod_producto: "YLABAT-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: null,
            talla: "M"
          },
          "p005lneg": {
            cod_producto: "YLABAT-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: null,
            talla: "L"
          },
          "p005xlneg": {
            cod_producto: "YLABAT-NEG-XL",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: null,
            talla: "XL"
          },
          "p005mbei": {
            cod_producto: "YLABAT-BEI-M",
            color_estampado: "Beige",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - BEIGE",
            precio_oferta: null,
            talla: "M"
          },
          "p005lbei": {
            cod_producto: "YLABAT-BEI-L",
            color_estampado: "Beige",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA L - BEIGE",
            precio_oferta: null,
            talla: "L"
          },
          "p005xlbei": {
            cod_producto: "YLABAT-BEI-XL",
            color_estampado: "Beige",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - BEIGE",
            precio_oferta: null,
            talla: "XL"
          },
          "p005mver": {
            cod_producto: "YLABAT-VER-M",
            color_estampado: "Verde",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - VERDE",
            precio_oferta: null,
            talla: "M"
          },
          "p005lver": {
            cod_producto: "YLABAT-VER-L",
            color_estampado: "Verde",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - VERDE",
            precio_oferta: null,
            talla: "L"
          },
          "p005xlver": {
            cod_producto: "YLABAT-VER-XL",
            color_estampado: "Verde",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA XL - VERDE",
            precio_oferta: null,
            talla: "XL"
          }
        }
      }
    },

    "prod006": {
      categoria_id: "pantalones",
      descripcion_corta: "Jogger deportivo de ajuste cómodo para entrenamiento y uso diario.",
      es_nuevo: true,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "gymshark",
      nombre: "CRITICAL JOGGER",
      precio: 420,
      subcolecciones: {
        variantes: {
          "p006mneg": {
            cod_producto: "CRIT-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: 369,
            talla: "M"
          },
          "p006lneg": {
            cod_producto: "CRIT-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: 369,
            talla: "L"
          },
          "p006xlneg": {
            cod_producto: "CRIT-NEG-XL",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: 369,
            talla: "XL"
          },
          "p006mgri": {
            cod_producto: "CRIT-GRI-M",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - GRIS",
            precio_oferta: 369,
            talla: "M"
          },
          "p006lgri": {
            cod_producto: "CRIT-GRI-L",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - GRIS",
            precio_oferta: 369,
            talla: "L"
          },
          "p006xlgri": {
            cod_producto: "CRIT-GRI-XL",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - GRIS",
            precio_oferta: 369,
            talla: "XL"
          },
          "p006mcre": {
            cod_producto: "CRIT-CRE-M",
            color_estampado: "Crema",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - CREMA",
            precio_oferta: 369,
            talla: "M"
          },
          "p006lcre": {
            cod_producto: "CRIT-CRE-L",
            color_estampado: "Crema",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - CREMA",
            precio_oferta: 369,
            talla: "L"
          },
          "p006xlcre": {
            cod_producto: "CRIT-CRE-XL",
            color_estampado: "Crema",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - CREMA",
            precio_oferta: 369,
            talla: "XL"
          }
        }
      }
    },

    "prod007": {
      categoria_id: "shorts",
      descripcion_corta: "Short deportivo ligero para gimnasio, cardio y entrenamiento de alta intensidad.",
      es_nuevo: true,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1617952236317-0bd127407984?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "nike",
      nombre: "NIKE TRAINING SHORT",
      precio: 320,
      subcolecciones: {
        variantes: {
          "p007mneg": {
            cod_producto: "NIKES-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: null,
            talla: "M"
          },
          "p007lneg": {
            cod_producto: "NIKES-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: null,
            talla: "L"
          },
          "p007xlneg": {
            cod_producto: "NIKES-NEG-XL",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: null,
            talla: "XL"
          },
          "p007mroj": {
            cod_producto: "NIKES-ROJ-M",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - ROJO",
            precio_oferta: null,
            talla: "M"
          },
          "p007lroj": {
            cod_producto: "NIKES-ROJ-L",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - ROJO",
            precio_oferta: null,
            talla: "L"
          },
          "p007xlroj": {
            cod_producto: "NIKES-ROJ-XL",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - ROJO",
            precio_oferta: null,
            talla: "XL"
          },
          "p007mver": {
            cod_producto: "NIKES-VER-M",
            color_estampado: "Verde",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - VERDE",
            precio_oferta: null,
            talla: "M"
          },
          "p007lver": {
            cod_producto: "NIKES-VER-L",
            color_estampado: "Verde",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA L - VERDE",
            precio_oferta: null,
            talla: "L"
          },
          "p007xlver": {
            cod_producto: "NIKES-VER-XL",
            color_estampado: "Verde",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - VERDE",
            precio_oferta: null,
            talla: "XL"
          }
        }
      }
    },

    "prod008": {
      categoria_id: "camisetas",
      descripcion_corta: "Camiseta oversize Adidas de estilo deportivo, tela suave y corte holgado.",
      es_nuevo: false,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1583743814966-8936f37f4678?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "adidas",
      nombre: "ADIDAS OVERSIZE",
      precio: 280,
      subcolecciones: {
        variantes: {
          "p008mneg": {
            cod_producto: "ADIOV-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: 230,
            talla: "M"
          },
          "p008lneg": {
            cod_producto: "ADIOV-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: 230,
            talla: "L"
          },
          "p008xlneg": {
            cod_producto: "ADIOV-NEG-XL",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: 230,
            talla: "XL"
          },
          "p008mbla": {
            cod_producto: "ADIOV-BLA-M",
            color_estampado: "Blanco",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - BLANCO",
            precio_oferta: 230,
            talla: "M"
          },
          "p008lbla": {
            cod_producto: "ADIOV-BLA-L",
            color_estampado: "Blanco",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - BLANCO",
            precio_oferta: 230,
            talla: "L"
          },
          "p008xlbla": {
            cod_producto: "ADIOV-BLA-XL",
            color_estampado: "Blanco",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - BLANCO",
            precio_oferta: 230,
            talla: "XL"
          },
          "p008mver": {
            cod_producto: "ADIOV-VER-M",
            color_estampado: "Verde",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - VERDE",
            precio_oferta: 230,
            talla: "M"
          },
          "p008lver": {
            cod_producto: "ADIOV-VER-L",
            color_estampado: "Verde",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - VERDE",
            precio_oferta: 230,
            talla: "L"
          },
          "p008xlver": {
            cod_producto: "ADIOV-VER-XL",
            color_estampado: "Verde",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - VERDE",
            precio_oferta: 230,
            talla: "XL"
          }
        }
      }
    },

    "prod009": {
      categoria_id: "shorts",
      descripcion_corta: "Short YoungLA de corte moderno, tela flexible y cómoda para entrenamiento de pierna.",
      es_nuevo: false,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "youngla",
      nombre: "YOUNGLA PERFORMANCE SHORT",
      precio: 300,
      subcolecciones: {
        variantes: {
          "p009mneg": {
            cod_producto: "YLAP-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: 250,
            talla: "M"
          },
          "p009lneg": {
            cod_producto: "YLAP-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: 250,
            talla: "L"
          },
          "p009xlneg": {
            cod_producto: "YLAP-NEG-XL",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: 250,
            talla: "XL"
          },
          "p009mver": {
            cod_producto: "YLAP-VER-M",
            color_estampado: "Verde",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - VERDE",
            precio_oferta: 250,
            talla: "M"
          },
          "p009lver": {
            cod_producto: "YLAP-VER-L",
            color_estampado: "Verde",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - VERDE",
            precio_oferta: 250,
            talla: "L"
          },
          "p009xlver": {
            cod_producto: "YLAP-VER-XL",
            color_estampado: "Verde",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - VERDE",
            precio_oferta: 250,
            talla: "XL"
          },
          "p009mgri": {
            cod_producto: "YLAP-GRI-M",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - GRIS",
            precio_oferta: 250,
            talla: "M"
          },
          "p009lgri": {
            cod_producto: "YLAP-GRI-L",
            color_estampado: "Gris",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - GRIS",
            precio_oferta: 250,
            talla: "L"
          },
          "p009xlgri": {
            cod_producto: "YLAP-GRI-XL",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - GRIS",
            precio_oferta: 250,
            talla: "XL"
          }
        }
      }
    },

    "prod010": {
      categoria_id: "chaquetas",
      descripcion_corta: "Chaqueta deportiva ligera tipo cortaviento con capucha y cierre frontal.",
      es_nuevo: true,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "nike",
      nombre: "NIKE WINDRUNNER",
      precio: 580,
      subcolecciones: {
        variantes: {
          "p010mneg": {
            cod_producto: "WIND-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: null,
            talla: "M"
          },
          "p010lneg": {
            cod_producto: "WIND-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: null,
            talla: "L"
          },
          "p010xlneg": {
            cod_producto: "WIND-NEG-XL",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: null,
            talla: "XL"
          },
          "p010mazu": {
            cod_producto: "WIND-AZU-M",
            color_estampado: "Azul",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - AZUL",
            precio_oferta: null,
            talla: "M"
          },
          "p010lazu": {
            cod_producto: "WIND-AZU-L",
            color_estampado: "Azul",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - AZUL",
            precio_oferta: null,
            talla: "L"
          },
          "p010xlazu": {
            cod_producto: "WIND-AZU-XL",
            color_estampado: "Azul",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - AZUL",
            precio_oferta: null,
            talla: "XL"
          },
          "p010mbei": {
            cod_producto: "WIND-BEI-M",
            color_estampado: "Beige",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - BEIGE",
            precio_oferta: null,
            talla: "M"
          },
          "p010lbei": {
            cod_producto: "WIND-BEI-L",
            color_estampado: "Beige",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA L - BEIGE",
            precio_oferta: null,
            talla: "L"
          },
          "p010xlbei": {
            cod_producto: "WIND-BEI-XL",
            color_estampado: "Beige",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - BEIGE",
            precio_oferta: null,
            talla: "XL"
          }
        }
      }
    },

    "prod011": {
      categoria_id: "buzos",
      descripcion_corta: "Hoodie deportivo de corte relajado y diseño minimalista para uso urbano y gimnasio.",
      es_nuevo: false,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "gymshark",
      nombre: "GYMSHARK LEGACY HOODIE",
      precio: 390,
      subcolecciones: {
        variantes: {
          "p011mneg": {
            cod_producto: "LEGACY-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: null,
            talla: "M"
          },
          "p011lneg": {
            cod_producto: "LEGACY-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: null,
            talla: "L"
          },
          "p011xlneg": {
            cod_producto: "LEGACY-NEG-XL",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: null,
            talla: "XL"
          },
          "p011mgri": {
            cod_producto: "LEGACY-GRI-M",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - GRIS",
            precio_oferta: null,
            talla: "M"
          },
          "p011lgri": {
            cod_producto: "LEGACY-GRI-L",
            color_estampado: "Gris",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA L - GRIS",
            precio_oferta: null,
            talla: "L"
          },
          "p011xlgri": {
            cod_producto: "LEGACY-GRI-XL",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - GRIS",
            precio_oferta: null,
            talla: "XL"
          },
          "p011mcre": {
            cod_producto: "LEGACY-CRE-M",
            color_estampado: "Crema",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - CREMA",
            precio_oferta: null,
            talla: "M"
          },
          "p011lcre": {
            cod_producto: "LEGACY-CRE-L",
            color_estampado: "Crema",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - CREMA",
            precio_oferta: null,
            talla: "L"
          },
          "p011xlcre": {
            cod_producto: "LEGACY-CRE-XL",
            color_estampado: "Crema",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA XL - CREMA",
            precio_oferta: null,
            talla: "XL"
          }
        }
      }
    },

    "prod012": {
      categoria_id: "camisetas",
      descripcion_corta: "Camiseta UFC Fight Night con estampado frontal y corte deportivo.",
      es_nuevo: true,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "ufc",
      nombre: "UFC FIGHT NIGHT",
      precio: 240,
      subcolecciones: {
        variantes: {
          "p012mneg": {
            cod_producto: "UFCFN-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: 199,
            talla: "M"
          },
          "p012lneg": {
            cod_producto: "UFCFN-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: 199,
            talla: "L"
          },
          "p012xlneg": {
            cod_producto: "UFCFN-NEG-XL",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: 199,
            talla: "XL"
          },
          "p012mroj": {
            cod_producto: "UFCFN-ROJ-M",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - ROJO",
            precio_oferta: 199,
            talla: "M"
          },
          "p012lroj": {
            cod_producto: "UFCFN-ROJ-L",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - ROJO",
            precio_oferta: 199,
            talla: "L"
          },
          "p012xlroj": {
            cod_producto: "UFCFN-ROJ-XL",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - ROJO",
            precio_oferta: 199,
            talla: "XL"
          },
          "p012mbla": {
            cod_producto: "UFCFN-BLA-M",
            color_estampado: "Blanco",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - BLANCO",
            precio_oferta: 199,
            talla: "M"
          },
          "p012lbla": {
            cod_producto: "UFCFN-BLA-L",
            color_estampado: "Blanco",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - BLANCO",
            precio_oferta: 199,
            talla: "L"
          },
          "p012xlbla": {
            cod_producto: "UFCFN-BLA-XL",
            color_estampado: "Blanco",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - BLANCO",
            precio_oferta: 199,
            talla: "XL"
          }
        }
      }
    },

    "prod013": {
      categoria_id: "compresion",
      descripcion_corta: "Camiseta de compresión manga larga para entrenamientos intensos y clima fresco.",
      es_nuevo: true,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1583743814966-8936f37f4678?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "onix",
      nombre: "ONIX PRO COMPRESSION",
      precio: 290,
      subcolecciones: {
        variantes: {
          "p013mneg": {
            cod_producto: "ONIXPRO-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: null,
            talla: "M"
          },
          "p013lneg": {
            cod_producto: "ONIXPRO-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: null,
            talla: "L"
          },
          "p013xlneg": {
            cod_producto: "ONIXPRO-NEG-XL",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: null,
            talla: "XL"
          },
          "p013mplo": {
            cod_producto: "ONIXPRO-PLO-M",
            color_estampado: "Plomo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - PLOMO",
            precio_oferta: null,
            talla: "M"
          },
          "p013lplo": {
            cod_producto: "ONIXPRO-PLO-L",
            color_estampado: "Plomo",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA L - PLOMO",
            precio_oferta: null,
            talla: "L"
          },
          "p013xlplo": {
            cod_producto: "ONIXPRO-PLO-XL",
            color_estampado: "Plomo",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - PLOMO",
            precio_oferta: null,
            talla: "XL"
          },
          "p013mazu": {
            cod_producto: "ONIXPRO-AZU-M",
            color_estampado: "Azul",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - AZUL",
            precio_oferta: null,
            talla: "M"
          },
          "p013lazu": {
            cod_producto: "ONIXPRO-AZU-L",
            color_estampado: "Azul",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - AZUL",
            precio_oferta: null,
            talla: "L"
          },
          "p013xlazu": {
            cod_producto: "ONIXPRO-AZU-XL",
            color_estampado: "Azul",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA XL - AZUL",
            precio_oferta: null,
            talla: "XL"
          }
        }
      }
    },

    "prod014": {
      categoria_id: "shorts",
      descripcion_corta: "Short ligero con corte atlético y diseño minimalista para gimnasio.",
      es_nuevo: false,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1617952236317-0bd127407984?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "gymshark",
      nombre: "GYMSHARK SPORT SHORT",
      precio: 310,
      subcolecciones: {
        variantes: {
          "p014mneg": {
            cod_producto: "GYMSS-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: null,
            talla: "M"
          },
          "p014lneg": {
            cod_producto: "GYMSS-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: null,
            talla: "L"
          },
          "p014xlneg": {
            cod_producto: "GYMSS-NEG-XL",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: null,
            talla: "XL"
          },
          "p014mgri": {
            cod_producto: "GYMSS-GRI-M",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - GRIS",
            precio_oferta: null,
            talla: "M"
          },
          "p014lgri": {
            cod_producto: "GYMSS-GRI-L",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - GRIS",
            precio_oferta: null,
            talla: "L"
          },
          "p014xlgri": {
            cod_producto: "GYMSS-GRI-XL",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - GRIS",
            precio_oferta: null,
            talla: "XL"
          },
          "p014mazu": {
            cod_producto: "GYMSS-AZU-M",
            color_estampado: "Azul",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - AZUL",
            precio_oferta: null,
            talla: "M"
          },
          "p014lazu": {
            cod_producto: "GYMSS-AZU-L",
            color_estampado: "Azul",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA L - AZUL",
            precio_oferta: null,
            talla: "L"
          },
          "p014xlazu": {
            cod_producto: "GYMSS-AZU-XL",
            color_estampado: "Azul",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - AZUL",
            precio_oferta: null,
            talla: "XL"
          }
        }
      }
    },

    "prod015": {
      categoria_id: "camisetas",
      descripcion_corta: "Camiseta Nike deportiva de corte regular para entrenamiento y uso diario.",
      es_nuevo: true,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1583743814966-8936f37f4678?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "nike",
      nombre: "NIKE ESSENTIAL TEE",
      precio: 260,
      subcolecciones: {
        variantes: {
          "p015mneg": {
            cod_producto: "NIKEE-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: 220,
            talla: "M"
          },
          "p015lneg": {
            cod_producto: "NIKEE-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: 220,
            talla: "L"
          },
          "p015xlneg": {
            cod_producto: "NIKEE-NEG-XL",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: 220,
            talla: "XL"
          },
          "p015mbla": {
            cod_producto: "NIKEE-BLA-M",
            color_estampado: "Blanco",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - BLANCO",
            precio_oferta: 220,
            talla: "M"
          },
          "p015lbla": {
            cod_producto: "NIKEE-BLA-L",
            color_estampado: "Blanco",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - BLANCO",
            precio_oferta: 220,
            talla: "L"
          },
          "p015xlbla": {
            cod_producto: "NIKEE-BLA-XL",
            color_estampado: "Blanco",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - BLANCO",
            precio_oferta: 220,
            talla: "XL"
          },
          "p015mver": {
            cod_producto: "NIKEE-VER-M",
            color_estampado: "Verde",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - VERDE",
            precio_oferta: 220,
            talla: "M"
          },
          "p015lver": {
            cod_producto: "NIKEE-VER-L",
            color_estampado: "Verde",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - VERDE",
            precio_oferta: 220,
            talla: "L"
          },
          "p015xlver": {
            cod_producto: "NIKEE-VER-XL",
            color_estampado: "Verde",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - VERDE",
            precio_oferta: 220,
            talla: "XL"
          }
        }
      }
    },

    "prod016": {
      categoria_id: "pantalones",
      descripcion_corta: "Jogger Adidas deportivo con cintura ajustable y corte tapered.",
      es_nuevo: false,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "adidas",
      nombre: "ADIDAS ESSENTIAL JOGGER",
      precio: 410,
      subcolecciones: {
        variantes: {
          "p016mneg": {
            cod_producto: "ADIJOG-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: null,
            talla: "M"
          },
          "p016lneg": {
            cod_producto: "ADIJOG-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: null,
            talla: "L"
          },
          "p016xlneg": {
            cod_producto: "ADIJOG-NEG-XL",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: null,
            talla: "XL"
          },
          "p016mgri": {
            cod_producto: "ADIJOG-GRI-M",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - GRIS",
            precio_oferta: null,
            talla: "M"
          },
          "p016lgri": {
            cod_producto: "ADIJOG-GRI-L",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - GRIS",
            precio_oferta: null,
            talla: "L"
          },
          "p016xlgri": {
            cod_producto: "ADIJOG-GRI-XL",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - GRIS",
            precio_oferta: null,
            talla: "XL"
          },
          "p016mbei": {
            cod_producto: "ADIJOG-BEI-M",
            color_estampado: "Beige",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - BEIGE",
            precio_oferta: null,
            talla: "M"
          },
          "p016lbei": {
            cod_producto: "ADIJOG-BEI-L",
            color_estampado: "Beige",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA L - BEIGE",
            precio_oferta: null,
            talla: "L"
          },
          "p016xlbei": {
            cod_producto: "ADIJOG-BEI-XL",
            color_estampado: "Beige",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - BEIGE",
            precio_oferta: null,
            talla: "XL"
          }
        }
      }
    },

    "prod017": {
      categoria_id: "compresion",
      descripcion_corta: "Remera de compresión UFC para entrenamiento, ajuste firme y tela elástica.",
      es_nuevo: true,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "ufc",
      nombre: "UFC PRO COMPRESSION",
      precio: 270,
      subcolecciones: {
        variantes: {
          "p017mneg": {
            cod_producto: "UFCPRO-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: 225,
            talla: "M"
          },
          "p017lneg": {
            cod_producto: "UFCPRO-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: 225,
            talla: "L"
          },
          "p017xlneg": {
            cod_producto: "UFCPRO-NEG-XL",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: 225,
            talla: "XL"
          },
          "p017mroj": {
            cod_producto: "UFCPRO-ROJ-M",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - ROJO",
            precio_oferta: 225,
            talla: "M"
          },
          "p017lroj": {
            cod_producto: "UFCPRO-ROJ-L",
            color_estampado: "Rojo",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - ROJO",
            precio_oferta: 225,
            talla: "L"
          },
          "p017xlroj": {
            cod_producto: "UFCPRO-ROJ-XL",
            color_estampado: "Rojo",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - ROJO",
            precio_oferta: 225,
            talla: "XL"
          },
          "p017mplo": {
            cod_producto: "UFCPRO-PLO-M",
            color_estampado: "Plomo",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - PLOMO",
            precio_oferta: 225,
            talla: "M"
          },
          "p017lplo": {
            cod_producto: "UFCPRO-PLO-L",
            color_estampado: "Plomo",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - PLOMO",
            precio_oferta: 225,
            talla: "L"
          },
          "p017xlplo": {
            cod_producto: "UFCPRO-PLO-XL",
            color_estampado: "Plomo",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - PLOMO",
            precio_oferta: 225,
            talla: "XL"
          }
        }
      }
    },

    "prod018": {
      categoria_id: "camisetas",
      descripcion_corta: "Camiseta YoungLA oversize con estilo streetwear y corte amplio.",
      es_nuevo: false,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "youngla",
      nombre: "YOUNGLA OVERSIZE TEE",
      precio: 290,
      subcolecciones: {
        variantes: {
          "p018mneg": {
            cod_producto: "YLAOV-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: null,
            talla: "M"
          },
          "p018lneg": {
            cod_producto: "YLAOV-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: null,
            talla: "L"
          },
          "p018xlneg": {
            cod_producto: "YLAOV-NEG-XL",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: null,
            talla: "XL"
          },
          "p018mbla": {
            cod_producto: "YLAOV-BLA-M",
            color_estampado: "Blanco",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - BLANCO",
            precio_oferta: null,
            talla: "M"
          },
          "p018lbla": {
            cod_producto: "YLAOV-BLA-L",
            color_estampado: "Blanco",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA L - BLANCO",
            precio_oferta: null,
            talla: "L"
          },
          "p018xlbla": {
            cod_producto: "YLAOV-BLA-XL",
            color_estampado: "Blanco",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - BLANCO",
            precio_oferta: null,
            talla: "XL"
          },
          "p018mcre": {
            cod_producto: "YLAOV-CRE-M",
            color_estampado: "Crema",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA M - CREMA",
            precio_oferta: null,
            talla: "M"
          },
          "p018lcre": {
            cod_producto: "YLAOV-CRE-L",
            color_estampado: "Crema",
            disponible: false,
            en_oferta: false,
            nombre_variante: "TALLA L - CREMA",
            precio_oferta: null,
            talla: "L"
          },
          "p018xlcre": {
            cod_producto: "YLAOV-CRE-XL",
            color_estampado: "Crema",
            disponible: true,
            en_oferta: false,
            nombre_variante: "TALLA XL - CREMA",
            precio_oferta: null,
            talla: "XL"
          }
        }
      }
    },

    "prod019": {
      categoria_id: "buzos",
      descripcion_corta: "Buzo Adidas deportivo con capucha, bolsillo frontal y corte cómodo.",
      es_nuevo: true,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "adidas",
      nombre: "ADIDAS TRAINING HOODIE",
      precio: 380,
      subcolecciones: {
        variantes: {
          "p019mneg": {
            cod_producto: "ADIHD-NEG-M",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: 330,
            talla: "M"
          },
          "p019lneg": {
            cod_producto: "ADIHD-NEG-L",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: 330,
            talla: "L"
          },
          "p019xlneg": {
            cod_producto: "ADIHD-NEG-XL",
            color_estampado: "Negro",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: 330,
            talla: "XL"
          },
          "p019mgri": {
            cod_producto: "ADIHD-GRI-M",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - GRIS",
            precio_oferta: 330,
            talla: "M"
          },
          "p019lgri": {
            cod_producto: "ADIHD-GRI-L",
            color_estampado: "Gris",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - GRIS",
            precio_oferta: 330,
            talla: "L"
          },
          "p019xlgri": {
            cod_producto: "ADIHD-GRI-XL",
            color_estampado: "Gris",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA XL - GRIS",
            precio_oferta: 330,
            talla: "XL"
          },
          "p019mazu": {
            cod_producto: "ADIHD-AZU-M",
            color_estampado: "Azul",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA M - AZUL",
            precio_oferta: 330,
            talla: "M"
          },
          "p019lazu": {
            cod_producto: "ADIHD-AZU-L",
            color_estampado: "Azul",
            disponible: true,
            en_oferta: true,
            nombre_variante: "TALLA L - AZUL",
            precio_oferta: 330,
            talla: "L"
          },
          "p019xlazu": {
            cod_producto: "ADIHD-AZU-XL",
            color_estampado: "Azul",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - AZUL",
            precio_oferta: 330,
            talla: "XL"
          }
        }
      }
    },

    "prod020": {
      categoria_id: "chaquetas",
      descripcion_corta: "Chaqueta streetwear con diseño urbano, cierre frontal y corte relajado.",
      es_nuevo: false,
      estado: "activo",
      imagenes: [
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"
      ],
      marca_id: "zip",
      nombre: "ZIP STREET JACKET",
      precio: 520,
      subcolecciones: {
        variantes: {
          "p020mneg": {
            cod_producto: "ZIPJKT-NEG-M",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA M - NEGRO",
            precio_oferta: 450,
            talla: "M"
          },
          "p020lneg": {
            cod_producto: "ZIPJKT-NEG-L",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - NEGRO",
            precio_oferta: 450,
            talla: "L"
          },
          "p020xlneg": {
            cod_producto: "ZIPJKT-NEG-XL",
            color_estampado: "Negro",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - NEGRO",
            precio_oferta: 450,
            talla: "XL"
          },
          "p020mgri": {
            cod_producto: "ZIPJKT-GRI-M",
            color_estampado: "Gris",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA M - GRIS",
            precio_oferta: 450,
            talla: "M"
          },
          "p020lgri": {
            cod_producto: "ZIPJKT-GRI-L",
            color_estampado: "Gris",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - GRIS",
            precio_oferta: 450,
            talla: "L"
          },
          "p020xlgri": {
            cod_producto: "ZIPJKT-GRI-XL",
            color_estampado: "Gris",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - GRIS",
            precio_oferta: 450,
            talla: "XL"
          },
          "p020mver": {
            cod_producto: "ZIPJKT-VER-M",
            color_estampado: "Verde",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA M - VERDE",
            precio_oferta: 450,
            talla: "M"
          },
          "p020lver": {
            cod_producto: "ZIPJKT-VER-L",
            color_estampado: "Verde",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA L - VERDE",
            precio_oferta: 450,
            talla: "L"
          },
          "p020xlver": {
            cod_producto: "ZIPJKT-VER-XL",
            color_estampado: "Verde",
            disponible: false,
            en_oferta: true,
            nombre_variante: "TALLA XL - VERDE",
            precio_oferta: 450,
            talla: "XL"
          }
        }
      }
    }
  }
};