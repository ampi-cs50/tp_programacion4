# frozen_string_literal: true

puts "===================================================="
puts "  MIDORI'S FLOW - Activewear, Yoga & Running Catalog"
puts "===================================================="

# -------------------------------------------------------------------------
# 1. CATEGORÍAS (Enfocadas en Yoga, Pilates, Running & Caminata)
# -------------------------------------------------------------------------
puts "\n[1/3] Configurando categorías Midori's Flow..."

# Categorías Principales
cat_mujer = Category.find_or_create_by!(name: "Mujer") do |c|
  c.parent_id = nil
  c.description = "Indumentaria técnica para yoga, pilates, running y entrenamiento."
end
cat_mujer.update!(parent_id: nil)

cat_hombre = Category.find_or_create_by!(name: "Hombre") do |c|
  c.parent_id = nil
  c.description = "Ropa deportiva de alto rendimiento para correr, entrenar y caminar."
end
cat_hombre.update!(parent_id: nil)

cat_accesorios = Category.find_or_create_by!(name: "Accesorios") do |c|
  c.parent_id = nil
  c.description = "Equipamiento para yoga, riñoneras para running y complementos."
end
cat_accesorios.update!(parent_id: nil)

# Subcategorías Mujer
sub_m_leggings = Category.find_or_create_by!(name: "Leggings & Calzas", parent: cat_mujer)
sub_m_tops     = Category.find_or_create_by!(name: "Tops & Corpiños", parent: cat_mujer)
sub_m_abrigos  = Category.find_or_create_by!(name: "Camperas & Buzos", parent: cat_mujer)
sub_m_shorts   = Category.find_or_create_by!(name: "Shorts Deportivos", parent: cat_mujer)

# Subcategorías Hombre
sub_h_joggers  = Category.find_or_create_by!(name: "Pantalones & Joggers", parent: cat_hombre)
sub_h_remeras  = Category.find_or_create_by!(name: "Remeras & Musculosas", parent: cat_hombre)
sub_h_shorts   = Category.find_or_create_by!(name: "Shorts Deportivos", parent: cat_hombre)
sub_h_abrigos  = Category.find_or_create_by!(name: "Camperas & Hoodies", parent: cat_hombre)

# Subcategorías Accesorios
sub_a_yoga     = Category.find_or_create_by!(name: "Mats & Yoga", parent: cat_accesorios)
sub_a_bolsos   = Category.find_or_create_by!(name: "Riñoneras & Bolsos", parent: cat_accesorios)
sub_a_botellas = Category.find_or_create_by!(name: "Botellas & Complementos", parent: cat_accesorios)

puts "Categorías Midori's Flow listas:"
[ cat_mujer, cat_hombre, cat_accesorios ].each do |p|
  puts " - #{p.name}: #{p.subcategories.pluck(:name).join(', ')}"
end

# -------------------------------------------------------------------------
# 2. HELPER PARA ADJUNTAR FOTO LOCAL DE ESTUDIO
# -------------------------------------------------------------------------
def attach_local_image(product, local_filename)
  file_path = Rails.root.join("db", "seeds", "images", local_filename)
  return unless File.exist?(file_path)

  # Reemplazar la imagen para garantizar que use la foto de estudio de catálogo
  product.images.purge if product.images.attached?
  product.images.attach(
    io: File.open(file_path),
    filename: local_filename,
    content_type: "image/jpeg"
  )
  puts "    -> Foto de catálogo adjuntada: #{local_filename}"
end

# -------------------------------------------------------------------------
# 3. LISTADO DE PRODUCTOS ACTIVEWEAR MIDORI'S FLOW
# -------------------------------------------------------------------------
puts "\n[2/3] Creando catálogo de activewear..."

activewear_catalog = [
  # --- MUJER ---
  {
    target_id: 1, # Reutiliza Product 1 para conservar órdenes existentes
    name: "Leggings Align™ Tiro Alto 25\"",
    category: sub_m_leggings,
    price: 38000.0,
    description: "Nuestra prenda insignia para yoga y pilates. Confeccionada en tejido Nulu™ con una sensación piel de durazno tan liviana que apenas se siente. Elástica en 4 direcciones, cintura alta envolvente y máxima absorción del sudor.",
    image_file: "align_leggings.jpg",
    variants: [
      { color: "Negro", hex_color: "#111111", size: "XS", stock: 10, sku: "ALI-LEG-01-XS-BLK" },
      { color: "Negro", hex_color: "#111111", size: "S", stock: 15, sku: "ALI-LEG-01-S-BLK" },
      { color: "Negro", hex_color: "#111111", size: "M", stock: 18, sku: "ALI-LEG-01-M-BLK" },
      { color: "Negro", hex_color: "#111111", size: "L", stock: 8, sku: "ALI-LEG-01-L-BLK" },
      { color: "Verde Salvia", hex_color: "#708271", size: "S", stock: 12, sku: "ALI-LEG-01-S-GRN" },
      { color: "Verde Salvia", hex_color: "#708271", size: "M", stock: 14, sku: "ALI-LEG-01-M-GRN" },
      { color: "Borgoña Plum", hex_color: "#581825", size: "S", stock: 8, sku: "ALI-LEG-01-S-BRG" }
    ]
  },
  {
    name: "Corpiño Deportivo Energy Bra™",
    category: sub_m_tops,
    price: 22000.0,
    description: "Corpiño deportivo multiuso con tiras dobles cruzadas en la espalda que ofrecen sujeción media sin presionar. Tejido Luxtreme™ fresco, transpirable y de secado rápido, perfecto para yoga, pilates o entrenamiento funcional.",
    image_file: "energy_bra.jpg",
    variants: [
      { color: "Verde Salvia", hex_color: "#708271", size: "S", stock: 12, sku: "ENE-BRA-01-S-GRN" },
      { color: "Verde Salvia", hex_color: "#708271", size: "M", stock: 15, sku: "ENE-BRA-01-M-GRN" },
      { color: "Blanco Nieve", hex_color: "#FFFFFF", size: "S", stock: 10, sku: "ENE-BRA-01-S-WHT" },
      { color: "Blanco Nieve", hex_color: "#FFFFFF", size: "M", stock: 12, sku: "ENE-BRA-01-M-WHT" },
      { color: "Negro Intenso", hex_color: "#111111", size: "S", stock: 14, sku: "ENE-BRA-01-S-BLK" },
      { color: "Negro Intenso", hex_color: "#111111", size: "M", stock: 16, sku: "ENE-BRA-01-M-BLK" }
    ]
  },
  {
    name: "Campera Define Jacket Luon™",
    category: sub_m_abrigos,
    price: 52000.0,
    description: "La campera técnica entallada favorita para salir a caminar por la mañana o como capa post-yoga. Cuello alto térmico, orificios para el pulgar en los puños y mangas con cubremanos Cuffins™ integrados.",
    image_file: "define_jacket.jpg",
    variants: [
      { color: "Negro", hex_color: "#111111", size: "S", stock: 10, sku: "DEF-JAC-01-S-BLK" },
      { color: "Negro", hex_color: "#111111", size: "M", stock: 14, sku: "DEF-JAC-01-M-BLK" },
      { color: "Negro", hex_color: "#111111", size: "L", stock: 8, sku: "DEF-JAC-01-L-BLK" },
      { color: "Azul Marino", hex_color: "#1B2A4A", size: "S", stock: 8, sku: "DEF-JAC-01-S-NVY" },
      { color: "Azul Marino", hex_color: "#1B2A4A", size: "M", stock: 10, sku: "DEF-JAC-01-M-NVY" }
    ]
  },
  {
    name: "Biker Short Align™ 6\" Cintura Alta",
    category: sub_m_shorts,
    price: 26000.0,
    description: "Short ciclista de 6 pulgadas confeccionado en suave tejido Nulu™. Sujeción suave y elástica, cintura alta que no se dobla ni desliza y bolsillo oculto para guardar tarjetas o llaves al salir a trotar.",
    image_file: "biker_shorts.jpg",
    variants: [
      { color: "Negro", hex_color: "#111111", size: "XS", stock: 8, sku: "BIK-SHO-01-XS-BLK" },
      { color: "Negro", hex_color: "#111111", size: "S", stock: 15, sku: "BIK-SHO-01-S-BLK" },
      { color: "Negro", hex_color: "#111111", size: "M", stock: 14, sku: "BIK-SHO-01-M-BLK" },
      { color: "Gris Grafito", hex_color: "#4B4F54", size: "S", stock: 10, sku: "BIK-SHO-01-S-GRY" },
      { color: "Gris Grafito", hex_color: "#4B4F54", size: "M", stock: 10, sku: "BIK-SHO-01-M-GRY" }
    ]
  },
  {
    name: "Pantalón High-Rise Wide-Leg Pant",
    category: sub_m_leggings,
    price: 44000.0,
    description: "Pantalón de tiro alto y pierna ancha fluida confeccionado en tejido ultraligero y suave al tacto. Cintura elástica con cordón regulable, caída relajada y máxima comodidad para yoga, pilates o uso urbano diario.",
    image_file: "wide_leg_pant.jpg",
    variants: [
      { color: "Visón Taupe", hex_color: "#847968", size: "XS", stock: 8, sku: "WID-PNT-01-XS-TAU" },
      { color: "Visón Taupe", hex_color: "#847968", size: "S", stock: 14, sku: "WID-PNT-01-S-TAU" },
      { color: "Visón Taupe", hex_color: "#847968", size: "M", stock: 16, sku: "WID-PNT-01-M-TAU" },
      { color: "Visón Taupe", hex_color: "#847968", size: "L", stock: 10, sku: "WID-PNT-01-L-TAU" },
      { color: "Verde Esmeralda", hex_color: "#19684E", size: "XS", stock: 6, sku: "WID-PNT-01-XS-EMR" },
      { color: "Verde Esmeralda", hex_color: "#19684E", size: "S", stock: 12, sku: "WID-PNT-01-S-EMR" },
      { color: "Verde Esmeralda", hex_color: "#19684E", size: "M", stock: 15, sku: "WID-PNT-01-M-EMR" },
      { color: "Verde Esmeralda", hex_color: "#19684E", size: "L", stock: 9, sku: "WID-PNT-01-L-EMR" },
      { color: "Borgoña Ciruela", hex_color: "#422736", size: "XS", stock: 7, sku: "WID-PNT-01-XS-BRG" },
      { color: "Borgoña Ciruela", hex_color: "#422736", size: "S", stock: 13, sku: "WID-PNT-01-S-BRG" },
      { color: "Borgoña Ciruela", hex_color: "#422736", size: "M", stock: 12, sku: "WID-PNT-01-M-BRG" },
      { color: "Borgoña Ciruela", hex_color: "#422736", size: "L", stock: 8, sku: "WID-PNT-01-L-BRG" }
    ]
  },

  # --- HOMBRE ---
  {
    name: "Jogger Técnico ABC™ Regular Fit",
    category: sub_h_joggers,
    price: 48000.0,
    description: "Pantalón jogger diseñado para movimiento continuo. Cuenta con tecnología ABC™ ergonómica que elimina la tensión en la entrepierna, tejido Warpstreme™ elástico y bolsillos de viaje con cierre seguro.",
    image_file: "abc_jogger.jpg",
    variants: [
      { color: "Gris Pizarra", hex_color: "#4A5568", size: "S", stock: 8, sku: "ABC-JOG-01-S-SLA" },
      { color: "Gris Pizarra", hex_color: "#4A5568", size: "M", stock: 15, sku: "ABC-JOG-01-M-SLA" },
      { color: "Gris Pizarra", hex_color: "#4A5568", size: "L", stock: 12, sku: "ABC-JOG-01-L-SLA" },
      { color: "Negro", hex_color: "#111111", size: "M", stock: 12, sku: "ABC-JOG-01-M-BLK" },
      { color: "Negro", hex_color: "#111111", size: "L", stock: 14, sku: "ABC-JOG-01-L-BLK" }
    ]
  },
  {
    name: "Remera Running Metal Vent Tech 2.0",
    category: sub_h_remeras,
    price: 25000.0,
    description: "Remera diseñada específicamente para correr y entrenar intensamente. Estructura sin costuras laterales para eliminar fricción, malla transpirable localizada y tecnología Silverescent™ antiolor.",
    image_file: "metal_vent_tee.jpg",
    variants: [
      { color: "Negro Jaspeado", hex_color: "#2D3748", size: "S", stock: 10, sku: "MET-TEE-01-S-BLK" },
      { color: "Negro Jaspeado", hex_color: "#2D3748", size: "M", stock: 18, sku: "MET-TEE-01-M-BLK" },
      { color: "Negro Jaspeado", hex_color: "#2D3748", size: "L", stock: 15, sku: "MET-TEE-01-L-BLK" },
      { color: "Negro Jaspeado", hex_color: "#2D3748", size: "XL", stock: 8, sku: "MET-TEE-01-XL-BLK" }
    ]
  },
  {
    name: "Short Deportivo Pace Breaker 7\"",
    category: sub_h_shorts,
    price: 29000.0,
    description: "Short liviano diseñado para salir a correr o sesiones de pilates/fitness. Tejido elástico en 4 direcciones, bolsillo lateral con cierre seguro para el teléfono y cintura elástica antitranspirante.",
    image_file: "pace_breaker_shorts.jpg",
    variants: [
      { color: "Gris Carbón", hex_color: "#374151", size: "S", stock: 8, sku: "PAC-SHO-01-S-GRY" },
      { color: "Gris Carbón", hex_color: "#374151", size: "M", stock: 14, sku: "PAC-SHO-01-M-GRY" },
      { color: "Gris Carbón", hex_color: "#374151", size: "L", stock: 12, sku: "PAC-SHO-01-L-GRY" },
      { color: "Negro", hex_color: "#111111", size: "M", stock: 12, sku: "PAC-SHO-01-M-BLK" },
      { color: "Negro", hex_color: "#111111", size: "L", stock: 10, sku: "PAC-SHO-01-L-BLK" }
    ]
  },
  {
    name: "Short Classic-Fit Golf Short 8\"",
    category: sub_h_shorts,
    price: 36000.0,
    description: "Short de corte clásico diseñado para golf, caminata y uso casual deportivo. Tejido técnico Warpstreme™ elástico en 4 direcciones, repelente al agua, transpirable y con bolsillos profundos de seguridad.",
    image_file: "golf_short.jpg",
    variants: [
      { color: "Verde Esmeralda", hex_color: "#1F5A42", size: "S", stock: 8, sku: "GLF-SHO-01-S-EMR" },
      { color: "Verde Esmeralda", hex_color: "#1F5A42", size: "M", stock: 14, sku: "GLF-SHO-01-M-EMR" },
      { color: "Verde Esmeralda", hex_color: "#1F5A42", size: "L", stock: 12, sku: "GLF-SHO-01-L-EMR" },
      { color: "Verde Esmeralda", hex_color: "#1F5A42", size: "XL", stock: 7, sku: "GLF-SHO-01-XL-EMR" },
      { color: "Arena Beige", hex_color: "#C2B5A3", size: "S", stock: 10, sku: "GLF-SHO-01-S-BEG" },
      { color: "Arena Beige", hex_color: "#C2B5A3", size: "M", stock: 16, sku: "GLF-SHO-01-M-BEG" },
      { color: "Arena Beige", hex_color: "#C2B5A3", size: "L", stock: 14, sku: "GLF-SHO-01-L-BEG" },
      { color: "Arena Beige", hex_color: "#C2B5A3", size: "XL", stock: 8, sku: "GLF-SHO-01-XL-BEG" },
      { color: "Gris Pizarra", hex_color: "#676E73", size: "S", stock: 9, sku: "GLF-SHO-01-S-GRY" },
      { color: "Gris Pizarra", hex_color: "#676E73", size: "M", stock: 15, sku: "GLF-SHO-01-M-GRY" },
      { color: "Gris Pizarra", hex_color: "#676E73", size: "L", stock: 11, sku: "GLF-SHO-01-L-GRY" },
      { color: "Gris Pizarra", hex_color: "#676E73", size: "XL", stock: 6, sku: "GLF-SHO-01-XL-GRY" }
    ]
  },
  {
    name: "Buzo Hoodie City Sweat French Terry",
    category: sub_h_abrigos,
    price: 46000.0,
    description: "Buzo con capucha confeccionado en algodón French Terry respirable. Paneles anatómicos en las axilas para mayor ventilación y bolsillo canguro discreto. Ideal para caminatas o abrigo post-gym.",
    image_file: "city_sweat_hoodie.jpg",
    variants: [
      { color: "Gris Melange", hex_color: "#9CA3AF", size: "S", stock: 6, sku: "CIT-HOD-01-S-GRY" },
      { color: "Gris Melange", hex_color: "#9CA3AF", size: "M", stock: 12, sku: "CIT-HOD-01-M-GRY" },
      { color: "Gris Melange", hex_color: "#9CA3AF", size: "L", stock: 15, sku: "CIT-HOD-01-L-GRY" },
      { color: "Negro", hex_color: "#181818", size: "M", stock: 10, sku: "CIT-HOD-01-M-BLK" }
    ]
  },

  # --- ACCESORIOS (Yoga, Running & Caminata) ---
  {
    name: "Mat de Yoga The Mat 5mm Reversible",
    category: sub_a_yoga,
    price: 34000.0,
    description: "Mat de yoga profesional de 5mm con base de caucho natural y amortiguación articular de alto confort. Capa superior de poliuretano que absorbe el sudor para mantener un agarre antideslizante insuperable.",
    image_file: "yoga_mat.jpg",
    variants: [
      { color: "Verde Bosque", hex_color: "#2D4B3E", size: "5mm", stock: 18, sku: "YOG-MAT-01-5M-GRN" },
      { color: "Negro Marmolado", hex_color: "#1F2937", size: "5mm", stock: 12, sku: "YOG-MAT-01-5M-BLK" }
    ]
  },
  {
    target_id: 2, # Reutiliza Product 2 para conservar órdenes existentes
    name: "Riñonera Everywhere Belt Bag",
    category: sub_a_bolsos,
    price: 21000.0,
    description: "Riñonera técnica compacta (19 x 13 x 5 cm) fabricada en nylon repelente al agua. Correa regulable para llevar a la cintura o cruzada al pecho. Perfecta para caminatas, trote o yoga al aire libre.",
    image_file: "belt_bag.jpg",
    variants: [
      { color: "Negro", hex_color: "#111111", size: "19x13 cm", stock: 25, sku: "EVE-BAG-01-1L-BLK" },
      { color: "Blanco Hueso", hex_color: "#F3EFEA", size: "19x13 cm", stock: 15, sku: "EVE-BAG-01-1L-WHT" },
      { color: "Terracota Spiced", hex_color: "#A3523C", size: "19x13 cm", stock: 10, sku: "EVE-BAG-01-1L-TER" }
    ]
  },
  {
    name: "Cartera Slouchy Shoulder Bag",
    category: sub_a_bolsos,
    price: 32000.0,
    description: "Cartera de hombro estilo hobo con pliegues frontales (30 x 22 x 10 cm) confeccionada en nylon impermeable y liviano. Cierre superior seguro, compartimentos organizadores internos y correa ergonómica para uso diario o post-entrenamiento.",
    image_file: "shoulder_bag.jpg",
    variants: [
      { color: "Negro", hex_color: "#181818", size: "30x22 cm", stock: 18, sku: "SHO-BAG-01-30-BLK" },
      { color: "Blanco Hueso", hex_color: "#F2EFE9", size: "30x22 cm", stock: 14, sku: "SHO-BAG-01-30-WHT" },
      { color: "Rosa Lila", hex_color: "#DFBAD2", size: "30x22 cm", stock: 12, sku: "SHO-BAG-01-30-PNK" }
    ]
  },
  {
    name: "Visera Wide Band Runner Visor",
    category: sub_a_botellas,
    price: 16500.0,
    description: "Visera deportiva de running y outdoor con banda ancha absorbente de secado rápido (54 - 58 cm regulable). Diseño ultraliviano con protección solar curva y ajuste trasero elástico que no presiona.",
    image_file: "runner_visor.jpg",
    variants: [
      { color: "Negro", hex_color: "#262626", size: "54-58 cm", stock: 20, sku: "RUN-VIS-01-UNI-BLK" },
      { color: "Blanco", hex_color: "#F8F8F8", size: "54-58 cm", stock: 16, sku: "RUN-VIS-01-UNI-WHT" },
      { color: "Celeste Pastel", hex_color: "#8BC3EA", size: "54-58 cm", stock: 14, sku: "RUN-VIS-01-UNI-BLU" }
    ]
  },
  {
    name: "Broche Extra Large Claw Hair Clip",
    category: sub_a_botellas,
    price: 12500.0,
    description: "Broche para el cabello tamaño extra grande (11 cm) fabricado en acetato de celulosa resistente con resorte de alta sujeción. Ideal para recoger el pelo cómodamente durante tus sesiones de yoga, pilates o running.",
    image_file: "claw_clip.jpg",
    variants: [
      { color: "Carey Ámbar", hex_color: "#8B5A2B", size: "11 cm", stock: 22, sku: "CLW-CLP-01-11-AMB" },
      { color: "Rosa Cuarzo", hex_color: "#E8B7D0", size: "11 cm", stock: 18, sku: "CLW-CLP-01-11-PNK" },
      { color: "Nacarado Marfil", hex_color: "#EAE3D2", size: "11 cm", stock: 16, sku: "CLW-CLP-01-11-PRL" }
    ]
  },
  {
    name: "Botella Deportiva Back to Life 24oz",
    category: sub_a_botellas,
    price: 18000.0,
    description: "Botella térmica deportiva de 710ml (24oz) con aislamiento al vacío de doble pared de acero inoxidable. Tapa hermética a prueba de fugas con boquilla para beber fácil y manija para transportarla.",
    image_file: "water_bottle.jpg",
    variants: [
      { color: "Blanco Mate", hex_color: "#FFFFFF", size: "24oz", stock: 20, sku: "BTL-BOT-01-24-WHT" },
      { color: "Negro Mate", hex_color: "#1C1C1C", size: "24oz", stock: 22, sku: "BTL-BOT-01-24-BLK" }
    ]
  }
]

# Eliminar productos viejos que NO tengan ordenes de compra para limpiar la base de datos
old_prods_to_remove = Product.where.not(id: [ 1, 2 ])
old_prods_to_remove.each do |p|
  if p.order_items.empty?
    p.images.purge if p.images.attached?
    p.destroy
  end
end

activewear_catalog.each do |p_data|
  product = if p_data[:target_id]
              Product.find_or_initialize_by(id: p_data[:target_id])
  else
              Product.find_or_initialize_by(name: p_data[:name])
  end

  product.name = p_data[:name]
  product.category = p_data[:category]
  product.price = p_data[:price]
  product.description = p_data[:description]
  product.stock = p_data[:variants].sum { |v| v[:stock] }
  product.save!

  puts "  * [#{product.category.parent&.name} > #{product.category.name}] #{product.name} - $#{product.price}"

  # Adjuntar foto de estudio local
  attach_local_image(product, p_data[:image_file])

  # Eliminar variantes viejas que no tengan pedidos asociados
  product.product_variants.each do |pv|
    pv.destroy if pv.order_items.empty?
  end

  # Crear o actualizar variantes nuevas
  p_data[:variants].each do |v_data|
    variant = product.product_variants.find_or_initialize_by(color: v_data[:color], size: v_data[:size])
    variant.hex_color = v_data[:hex_color]
    variant.stock = v_data[:stock]
    variant.sku = v_data[:sku]
    variant.save!
  end
end

# Limpiar subcategorías obsoletas que hayan quedado sin productos
Category.where.not(id: [
  cat_mujer.id, cat_hombre.id, cat_accesorios.id,
  sub_m_leggings.id, sub_m_tops.id, sub_m_abrigos.id, sub_m_shorts.id,
  sub_h_joggers.id, sub_h_remeras.id, sub_h_shorts.id, sub_h_abrigos.id,
  sub_a_yoga.id, sub_a_bolsos.id, sub_a_botellas.id
]).each do |old_cat|
  old_cat.destroy if old_cat.products.empty? && old_cat.subcategories.empty?
end

# -------------------------------------------------------------------------
# 4. USUARIO DE PRUEBA / ADMINISTRADOR
# -------------------------------------------------------------------------
admin_user = User.find_or_initialize_by(email_address: "admin@midorisflow.com")
admin_user.admin = true
admin_user.password = "password123" if admin_user.new_record? || admin_user.password_digest.blank?
admin_user.save!

puts "\n[3/3] Catálogo Activewear cargado con éxito!"
puts "Total Categorías: #{Category.count}"
puts "Total Productos: #{Product.count}"
puts "Total Variantes: #{ProductVariant.count}"
puts "Usuario de prueba listo: #{admin_user.email_address} (password: password123)"
puts "===================================================="
