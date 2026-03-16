/// Custom background options for domain display
///
/// This enum mirrors js/src/types/custom-bg.ts
enum CustomBg {
  degenPoet1('DegenPoet#1'),
  rgb0x001('rgb0x00#1'),
  retardio1('Retardio#1'),
  retardio2('Retardio#2'),
  retardio3('Retardio#3'),
  numberArt0('NumberArt#0'),
  numberArt1('NumberArt#1'),
  numberArt2('NumberArt#2'),
  numberArt3('NumberArt#3'),
  numberArt4('NumberArt#4'),
  numberArt5('NumberArt#5'),
  numberArt6('NumberArt#6'),
  numberArt7('NumberArt#7'),
  numberArt8('NumberArt#8'),
  numberArt9('NumberArt#9'),
  valentineDay2025('Valentine\'sDay2025'),
  monkedao('Monkedao');

  const CustomBg(this.value);

  /// The string value of the custom background
  final String value;

  @override
  String toString() => value;
}
