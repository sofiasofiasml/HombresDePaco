import type {
  Suspect,
  Evidence,
  TimelineSlot,
  TimelineEventOption,
  DialogueLine,
} from './types';

export const CASE_METADATA = {
  caseCode: 'EXPEDIENTE #404-SA',
  operationName: '«OPERACIÓN TORTILLA QUEMADA»',
  precinct: 'Comisaría del Cuerpo Nacional de Policía — Distrito de San Antonio',
  location: 'Despacho del Comisario Don Lorenzo Castro y Archivo de Pruebas (Planta Baja)',
  dateTime: 'Miércoles, 09:00 AM (Sucesos ocurridos entre las 22:30h y las 23:45h de la noche anterior)',
  classification: 'SECRETO DE SUMARIO · NIVEL HUEVOS DE CORBATA',
  incidentSummary:
    'A las 09:00 AM llega una inspección sorpresa del Ministerio del Interior. Cuando el Comisario Don Lorenzo Castro abre su caja fuerte para entregar el dossier del operativo antidrogas más importante del año («Operación Cachopo Blanco»), dentro solo encuentra un tupperware con media tortilla de patatas con cebolla (algo reseca), el trofeo de petanca de 1998 manchado de hollín y una foto firmada del Fary. El dossier original ha sido triturado y usado como confeti en el calabozo 2, y el microondas de la sala de descansos ha explotado tras intentar calentar algo envuelto en papel de aluminio.',
  safeContents: [
    {
      item: 'Item #A1 — Tupperware de plástico (tapa azul)',
      detail: 'Contiene media tortilla de patatas con cebolla (algo reseca). Huellas en exterior e interior.',
      icon: '🥘',
    },
    {
      item: 'Item #A2 — Trofeo Campeón de Petanca San Antonio 1998',
      detail: 'Normalmente vive en la estantería de la sala de descansos, justo encima del microondas. Apareció dentro de la caja, aún tibio, con hollín y olor a panceta ahumada.',
      icon: '🏆',
    },
    {
      item: 'Item #A3 — Fotografía dedicada de «El Fary»',
      detail: 'Autografiada ("Para la familia Castro, ¡un hombre blandengue nunca!"). Presenta anotaciones al dorso con bolígrafo mordido.',
      icon: '🖼️',
    },
  ],
  lorenzoPostIt: {
    text: '«Como descubra quién me ha triturado el informe del Ministro y me ha metido media tortilla en la caja de caudales, ¡me lo cargo! ¡Les corto los huevos y los cuelgo del mástil de la bandera!»',
    signature: 'Firmado: Comisario Lorenzo Castro',
  },
};

export const SUSPECTS: Suspect[] = [
  {
    id: 'paco',
    name: 'Paco Miranda',
    rank: 'Inspector Jefe',
    badgeNumber: 'CNP-04412-SA',
    avatar: 'paco',
    statusDescription: 'Sudando frío, mancha de café en la corbata, mordisqueando el capuchón de un BIC y con unas gafas de cerca asomando del bolsillo.',
    alibiTime: '22:30h (Dice haberse marchado a casa)',
    alibiLocation: 'Domicilio conyugal (cenando croquetas de Lola)',
    statement:
      '«Don Lorenzo, por la gloria de mi madre, escúcheme antes de que le empiece a temblar el bigote. Yo ayer a las 22:30 me fui directo a casa porque Lola había hecho croquetas. Es verdad que tengo copia de la llave de su despacho, como yerno de confianza que soy, pero solo pasé a las 22:25 a dejarle el informe de gastos de las patrullas encima de la mesa. ¡Cuando yo salí, la caja fuerte estaba cerrada y el microondas ni siquiera echaba humo! Lo de los papeles picados en el calabozo tiene que ser cosa de un infiltrado de la mafia calabresa, se lo digo yo que tengo olfato policial.»',
    contradictions:
      'OJO: Jura que a las 22:30h ya estaba en casa cenando croquetas. Cruza esa hora con el Registro de Accesos (Prueba #03) y con lo que encontró Silvia en la ruleta de la caja fuerte (Prueba #01). Y fíjate: tiene llave del despacho... y es el yerno del Comisario.',
    noteSnippet:
      '• [PACO] Dice que a las 22:30h estaba en casa con croquetas de Lola. Tiene llave del despacho, es yerno de Don Lorenzo, muerde bolis y lleva gafas de cerca. Comprobar su placa en el registro de accesos.',
    polaroidCaption: 'Insp. Jefe P. Miranda — 09:15h',
    accentColor: '#8b261d',
  },
  {
    id: 'mariano',
    name: 'Mariano Moreno',
    rank: 'Subinspector',
    badgeNumber: 'CNP-04889-SA',
    avatar: 'mariano',
    statusDescription: 'Indignado, con las cejas ligeramente chamuscadas y olor a panceta.',
    alibiTime: '23:15h (Turno de noche en la cocina)',
    alibiLocation: 'Sala de descansos / Cocina de la planta baja',
    statement:
      '«A ver, que aquí enseguida se señala al eslabón más sensible. Sí, el tupper de tortilla es mío, ¡pero me lo habían secuestrado! Yo estaba haciendo el turno de noche tranquilamente y a las 23:15 puse a calentar un bocadillo de panceta envuelto en papel albal porque mantiene mejor el jugo térmico, eso es física cuántica básica. Hubo un chispazo táctico en el microondas, saltaron los plomos de toda la planta y, con el susto y a oscuras, me comí el dispensador de agua. ¡Pero yo al despacho de Don Lorenzo no entré en toda la noche!»',
    contradictions:
      'PISTA: Sus cejas chamuscadas cuadran con la explosión del microondas (23:15h). Si estaba en la cocina peleándose con el papel albal, ¿pudo estar a la vez en el despacho? Y si el tupper era suyo... ¿quién se lo «secuestró»?',
    noteSnippet:
      '• [MARIANO] Provocó el apagón a las 23:15h al meter un bocadillo en papel albal en el microondas. Le habían robado su tupper de tortilla.',
    polaroidCaption: 'Subinsp. M. Moreno — 09:22h',
    accentColor: '#5c4028',
  },
  {
    id: 'lucas',
    name: 'Lucas Fernández',
    rank: 'Subinspector',
    badgeNumber: 'CNP-05103-SA',
    avatar: 'lucas',
    statusDescription: 'Con gafas de sol dentro de la comisaría, chupa de cuero y palillo en la boca.',
    alibiTime: '23:00h - 23:15h (Parking subterráneo)',
    alibiLocation: 'Garaje oficial de patrullas (Planta -1)',
    statement:
      '«Yo no tengo por qué dar explicaciones de mis métodos, pero a las 23:00 estaba en el parking soldando el tubo de escape del coche patrulla con un soplete porque mañana teníamos seguimiento. Cuando saltaron los plomos a las 23:15 subí a oscuras con una linterna y, un par de minutos después, vi a Povedilla salir del despacho de Don Lorenzo con una bolsa de basura llena de tiras de papel. Temblaba como un flan y solo dijo: «Son órdenes de arriba». Yo no pregunté. En esta comisaría, cuanto menos sepas, mejor.»',
    contradictions:
      'PISTA: Su tarjeta entró al parking a las 22:58h, así que su coartada cuadra. Lo importante es lo que vio: Povedilla no actuaba solo, cumplía «órdenes de arriba». ¿Quién manda sobre Povedilla y estaba en el despacho a esa hora?',
    noteSnippet:
      '• [LUCAS] En el parking desde las 22:58h. Tras el apagón vio a Povedilla salir del despacho con tiras de papel: «órdenes de arriba».',
    polaroidCaption: 'Subinsp. L. Fernández — 09:30h',
    accentColor: '#2c3e50',
  },
  {
    id: 'curtis',
    name: 'Curtis Naranjo',
    rank: 'Agente Oficial',
    badgeNumber: 'CNP-06219-SA',
    avatar: 'curtis',
    statusDescription: 'Tranquilo, apoyado en el radiador bebiendo un batido de vainilla.',
    alibiTime: '22:45h - 23:30h (Guardia de entrada)',
    alibiLocation: 'Recepción y máquina de vending del pasillo central',
    statement:
      '«Mire, Comisario, yo solo sé que la combinación de su caja fuerte la cambió usted el martes y puso la fecha del ascenso de Povedilla para que nadie la adivinara. Y el único que se sabía esa fecha de memoria, aparte de usted, era el propio Povedilla... o alguien que llevara apuntada la combinación en el reverso de la foto del Fary.»',
    contradictions:
      'SOSPECHOSO: ¿Y cómo sabe Curtis tanto de la combinación? Aunque... su placa no aparece en el registro del despacho. Lo útil: la caja no se forzó, se abrió con la chuleta escrita detrás de la foto del Fary.',
    noteSnippet:
      '• [CURTIS] Revela que la combinación de la caja fuerte (14-02-98) estaba apuntada detrás de la foto del Fary.',
    polaroidCaption: 'Agente C. Naranjo — 09:40h',
    accentColor: '#2e5a44',
  },
];

export const EVIDENCES: Evidence[] = [
  {
    id: 'ev-01',
    code: 'PRUEBA #01',
    title: 'Informe Forense de Silvia Castro',
    subtitle: 'Laboratorio de Criminalística · Inspección Dactiloscópica y Residuos',
    type: 'forensic',
    labTag: 'LAB-CSI-SAN-ANTONIO-01',
    author: 'Dra. Silvia Castro (Inspectora Forense)',
    unlockedByDefault: true,
    clueKey: 'forensic-fary-croqueta',
    content:
      '«Análisis de los restos hallados en el despacho del Comisario: En la rueda de combinación de la caja fuerte se han hallado restos de grasa de croqueta casera mezclados con ceniza de puro barato. En el tupperware hay huellas de Mariano Moreno (exterior) y, en el interior de la tapa, de un agente cuya ficha dactilar corresponde a la placa CNP-04412-SA. La foto del Fary tiene escrito por detrás con bolígrafo mordido: "Combinación suegro: 14-02-98. No olvidar sacar el dossier para fotocopiarlo y meter el tupper de Mariano para gastarle una broma".»',
    highlights: [
      'Rueda de combinación: Grasa de croqueta casera mezclada con ceniza de puro (los puros son del propio Comisario).',
      'Tupperware: Huellas de Mariano por fuera y de la placa CNP-04412-SA en el interior de la tapa (busca esa placa en las fichas de sospechosos).',
      'Reverso de la foto del Fary (con boli mordido): "Combinación suegro: 14-02-98. No olvidar sacar el dossier para fotocopiarlo y meter el tupper de Mariano para gastarle una broma".',
    ],
    noteSnippet:
      '• [PRUEBA #01 - Forense] Grasa de croqueta en la ruleta, huellas de la placa CNP-04412-SA dentro del tupper y nota tras el Fary ("Combinación suegro: 14-02-98").',
  },
  {
    id: 'ev-02',
    code: 'PRUEBA #02',
    title: 'Transcripción de la Caja Negra (Audio de Seguridad)',
    subtitle: 'Cinta Magnetofónica #B-23 · Circuito Interno del Despacho',
    type: 'audio',
    labTag: 'AUDIO-SEC-2314H',
    author: 'Unidad Técnica de Telecomunicaciones (Subinsp. Montoya)',
    unlockedByDefault: true,
    clueKey: 'audio-shredder-confession',
    content:
      '[23:14:50] Voz masculina: "Povedilla, ¿dónde está el botón de fotocopiar en este cacharro, que sin las gafas de cerca no veo un pimiento?"\n[23:14:58] Ruido de cuchillas triturando papel.\n[23:15:02] Voz masculina: "Hostia santa, que esto no es el escáner, que me he comido el informe de mi suegro."\n[23:15:05] Explosión metálica en la cocina y corte del suministro eléctrico.\n[23:15:12] Voz masculina en la oscuridad: "¡Povedilla, las tiras al calabozo 2! Y tráeme el tupper de Mariano y lo primero que pilles para hacer bulto en la caja antes de que vuelva la luz."',
    highlights: [
      '23:14:50 — Un hombre intenta fotocopiar el dossier sin llevar puestas las gafas de cerca.',
      '23:14:58 — Ruido de trituradora: el informe acaba hecho tiras. 23:15:02 — El hombre llama «mi suegro» al Comisario.',
      '23:15:05 — Explosión del microondas en la cocina y apagón general.',
      '23:15:12 — A oscuras, el mismo hombre da órdenes a Povedilla.',
    ],
    noteSnippet:
      '• [PRUEBA #02 - Audio 23:14h] Voz masculina sin gafas de cerca confunde la trituradora con la fotocopiadora (23:14:58), llama «mi suegro» al Comisario y tras el apagón (23:15:05) da órdenes a Povedilla.',
    audioSegments: [
      {
        timestamp: '23:14:50',
        speaker: 'Voz masculina (sin identificar)',
        text: '«Povedilla, ¿dónde está el botón de fotocopiar en este cacharro, que sin las gafas de cerca no veo un pimiento?»',
        sfxType: 'voice_paco',
        durationMs: 3200,
      },
      {
        timestamp: '23:14:58',
        speaker: '[SONIDO AMBIENTE]',
        text: '[Ruido mecánico de cuchillas industriales triturando 80 folios de papel]',
        sfxType: 'shredder',
        durationMs: 2800,
      },
      {
        timestamp: '23:15:02',
        speaker: 'Voz masculina (sin identificar)',
        text: '«¡Hostia santa, que esto no es el escáner, que me he comido el informe de mi suegro!»',
        sfxType: 'voice_paco',
        durationMs: 3200,
      },
      {
        timestamp: '23:15:05',
        speaker: '[IMPACTO ELÉCTRICO]',
        text: '[Explosión metálica en la cocina y caída brusca del suministro eléctrico]',
        sfxType: 'explosion',
        durationMs: 2600,
      },
      {
        timestamp: '23:15:12',
        speaker: 'Voz masculina (a oscuras)',
        text: '«¡Povedilla, las tiras al calabozo 2! Y tráeme el tupper de Mariano y lo primero que pilles para hacer bulto en la caja antes de que vuelva la luz.»',
        sfxType: 'voice_whisper',
        durationMs: 4200,
      },
    ],
  },
  {
    id: 'ev-03',
    code: 'PRUEBA #03',
    title: 'Registro de Control de Accesos y Objetos Perdidos',
    subtitle: 'Terminal Magnética Z-90 · Puerta del Despacho y Archivo Planta Baja',
    type: 'log',
    labTag: 'LOG-TARJETAS-2310H',
    author: 'Oficina de Seguridad Interna (Agente Povedilla)',
    unlockedByDefault: true,
    clueKey: 'access-card-paco',
    content:
      'Listado electrónico de la terminal Z-90 de anoche. Nota de Povedilla: «Junto a la trituradora del despacho apareció un bolígrafo BIC azul con el capuchón mordisqueado. La tinta coincide con la del reverso de la foto del Fary».',
    highlights: [
      '23:10:14h — Alguien abre el despacho de Don Lorenzo con llave + tarjeta. Compara la placa con las fichas.',
      '23:15:05h — Corte eléctrico por sobrecarga en la Sala de Descansos.',
      'Hallazgo junto a la destructora: BIC azul con el capuchón mordido, misma tinta que la nota del Fary.',
    ],
    noteSnippet:
      '• [PRUEBA #03 - Accesos] 23:10h despacho abierto con llave + tarjeta CNP-04412-SA. 23:15h apagón. 23:45h misma tarjeta en el calabozo 2. BIC mordido junto a la trituradora.',
    logEntries: [
      {
        time: '22:18:04',
        cardHolder: 'CASTRO, LORENZO',
        badge: 'CNP-00101-SA',
        zone: 'Salida Parking Oficial',
        status: 'SALIDA OK',
      },
      {
        time: '22:58:40',
        cardHolder: 'FERNÁNDEZ, LUCAS',
        badge: 'CNP-05103-SA',
        zone: 'Taller / Parking Subterráneo',
        status: 'ACCESO OK',
      },
      {
        time: '23:10:14',
        cardHolder: '*** DATO PROTEGIDO (mando) ***',
        badge: 'CNP-04412-SA',
        zone: 'Despacho Comisario Don Lorenzo',
        status: 'APERTURA CON LLAVE + TARJETA',
        suspicious: true,
      },
      {
        time: '23:15:05',
        cardHolder: 'SISTEMA CENTRAL',
        badge: 'ERR-404-ELEC',
        zone: 'Planta Baja / Sala Descansos',
        status: 'CORTE ELÉCTRICO POR SOBRECARGA',
        suspicious: true,
      },
      {
        time: '23:45:03',
        cardHolder: '*** DATO PROTEGIDO (mando) ***',
        badge: 'CNP-04412-SA',
        zone: 'Archivo de Pruebas / Calabozo 2',
        status: 'ACCESO NOCTURNO REGISTRADO',
        suspicious: true,
      },
    ],
  },
  {
    id: 'ev-04',
    code: 'PRUEBA #04',
    title: 'Nota de Don Lorenzo y Fotografía de la Caja Fuerte',
    subtitle: 'Inspección Ocular del Despacho · Hallazgo de las 09:00 AM',
    type: 'photo',
    labTag: 'FOTO-CAJA-0900H',
    author: 'Comisario Don Lorenzo Castro',
    unlockedByDefault: true,
    clueKey: 'lorenzo-note-safe',
    content:
      '«Como descubra quién me ha triturado el informe del Ministro y me ha metido media tortilla en la caja de caudales, ¡me lo cargo! ¡Les corto los huevos y los cuelgo del mástil de la bandera! Firmado: Comisario Lorenzo Castro.»\n\nActa visual de la caja fuerte: sin señales de haber sido forzada. Dentro, el tupper de tortilla, el trofeo de petanca (que vive encima del microondas) y la foto del Fary, olvidada con la chuleta de la combinación escrita por detrás.\n\nDato del archivo de personal: Lola Castro, hija del Comisario, está casada con un miembro de la brigada.',
    highlights: [
      'Post-it manuscrito de Don Lorenzo confiscado en la puerta de la caja fuerte.',
      'La caja no se forzó: se abrió con la chuleta "Combinación suegro: 14-02-98" del reverso del Fary.',
      '¿Quién de la brigada puede llamar "suegro" a Don Lorenzo? (Lola Castro, su hija, está casada con uno de ellos.)',
    ],
    noteSnippet:
      '• [PRUEBA #04 - Caja Fuerte] Caja sin forzar, abierta con la chuleta "suegro". Lola Castro (hija del Comisario) está casada con alguien de la brigada.',
  },
];

export const TIMELINE_SLOTS: TimelineSlot[] = [
  {
    id: 'slot-1',
    time: '22:30h',
    label: 'Cena en casa de Lola',
    correctEventId: 'ev-time-2230',
  },
  {
    id: 'slot-2',
    time: '23:10h',
    label: 'Lector de tarjetas del despacho',
    correctEventId: 'ev-time-2310',
  },
  {
    id: 'slot-3',
    time: '23:14h',
    label: 'Cinta de la caja negra (I)',
    correctEventId: 'ev-time-2314',
  },
  {
    id: 'slot-4',
    time: '23:15h',
    label: 'Corte eléctrico',
    correctEventId: 'ev-time-2315',
  },
  {
    id: 'slot-5',
    time: '23:16h',
    label: 'Cinta de la caja negra (II)',
    correctEventId: 'ev-time-2316',
  },
];

export const TIMELINE_OPTIONS: TimelineEventOption[] = [
  {
    id: 'ev-time-2314',
    actor: 'Paco Miranda',
    text: 'Sin gafas, Paco confunde la destructora de papel con el escáner y tritura el informe del Ministro.',
  },
  {
    id: 'ev-time-2316',
    actor: 'Paco y Povedilla',
    text: 'A oscuras, Paco manda a Povedilla esconder las tiras en el calabozo 2 y traer el tupper y el trofeo de la cocina para rellenar la caja fuerte.',
  },
  {
    id: 'ev-time-2230',
    actor: 'Paco Miranda',
    text: 'Paco come croquetas de Lola pero no se queda en casa: vuelve a la comisaría con los dedos pringados de grasa.',
  },
  {
    id: 'ev-time-2315',
    actor: 'Mariano Moreno',
    text: 'Mariano calienta su bocadillo de panceta envuelto en papel albal en el microondas, provocando una explosión y el apagón.',
  },
  {
    id: 'ev-time-2310',
    actor: 'Paco Miranda',
    text: 'Paco entra al despacho de Don Lorenzo con su tarjeta y abre la caja fuerte mirando la combinación (14-02-98) detrás de la foto del Fary.',
  },
];

export const ACCUSATION_OPTIONS = {
  suspects: [
    { id: 'paco', label: 'Paco Miranda (Inspector Jefe)' },
    { id: 'mariano', label: 'Mariano Moreno (Subinspector)' },
    { id: 'lucas', label: 'Lucas Fernández (Subinspector)' },
    { id: 'curtis', label: 'Curtis Naranjo (Agente Oficial)' },
  ],
  weaponsOrTools: [
    {
      id: 'destructora',
      label: 'La destructora de papel del despacho del Comisario',
    },
    {
      id: 'soplete',
      label: 'El soplete de acetileno de Lucas en el parking subterráneo',
    },
    {
      id: 'fotocopiadora',
      label: 'La fotocopiadora del pasillo (se tragó el dossier en un atasco)',
    },
    {
      id: 'batidora',
      label: 'La máquina de batidos de vainilla del pasillo central',
    },
  ],
  motivesOrBlackout: [
    {
      id: 'albal_microondas',
      label: 'Mariano metió un bocadillo de panceta envuelto en papel albal en el microondas a las 23:15h',
    },
    {
      id: 'mafia_calabresa',
      label: 'Un comando infiltrado de la mafia calabresa saboteó el cuadro eléctrico general',
    },
    {
      id: 'soplete_parking',
      label: 'Lucas cortocircuitó la toma de tierra del garaje al soldar el tubo de escape',
    },
    {
      id: 'tormenta_san_antonio',
      label: 'Cayó un rayo en el mástil de la bandera de la comisaría durante la tormenta',
    },
  ],
};

export const CORRECT_ACCUSATION = {
  suspectId: 'paco',
  weaponOrTool: 'destructora',
  motive: 'albal_microondas',
};

export const RESOLUTION_DIALOGUE: DialogueLine[] = [
  {
    speaker: 'Comisario Don Lorenzo Castro',
    role: 'Al borde del infarto miocárdico',
    mood: 'furious',
    text: '«¡PACOOOO! ¡Ven aquí ahora mismo, desgraciado! ¿Me quieres explicar qué hace media tortilla con cebolla, el trofeo de petanca y el Fary mirándome desde el fondo de mi caja de caudales mientras el Ministro espera en la puerta?»',
  },
  {
    speaker: 'Paco Miranda',
    role: 'Inspector Jefe · Sudando a mares',
    mood: 'sweating',
    text: '«Don Lorenzo, escúcheme con serenidad policial... Yo solo quería hacer una copia de seguridad del dossier por si había una brecha de seguridad y, de paso, guardarle el tupper a Mariano en un lugar blindado. ¡Pero es que el botón de la destructora y el del escáner son igualicos si no llevo las gafas de cerca!»',
  },
  {
    speaker: 'Mariano Moreno',
    role: 'Subinspector · Con las cejas humeantes',
    mood: 'indignant',
    text: '«¡Encima que te salvo la vida con una maniobra de distracción electromagnética, Paco! Porque si no llega a explotar mi bocadillo de panceta en papel albal a las 23:15 en punto, te pillan las cámaras en alta definición comiéndote el informe como una cabra.»',
  },
  {
    speaker: 'Agente Povedilla',
    role: 'Asomando la cabeza desde el archivo con tiras de papel en el pelo',
    mood: 'terrified',
    text: '«Disculpe, señor Comisario... Entonces las tres bolsas de confeti que el Inspector Miranda me mandó esparcir por el calabozo 2 diciendo que era para el cumpleaños del detenido... ¿las voy pegando con celo, o las guardamos para la fiesta de cumpleaños de la Inspectora Irina?»',
  },
  {
    speaker: 'Comisario Don Lorenzo Castro',
    role: 'Apretándose el puente de la nariz',
    mood: 'furious',
    text: '«¡Mis santos cojones, Paco! ¡Treinta y cinco años de servicio en el Cuerpo para acabar entregándole al Ministro del Interior media tortilla fría y un autógrafo del Fary! ¡Povedilla, traiga el celo! ¡Y ustedes dos, a pegar tiras hasta que se pueda leer hasta la última coma o los mando a regular el tráfico en una rotonda de Soria! ¡Y que alguien felicite a la Inspectora Irina, que es la única que ha hecho su trabajo en esta comisaría!»',
  },
];
