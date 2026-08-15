package com.invetoryia.backend.common.seeder;

import com.invetoryia.backend.category.Category;
import com.invetoryia.backend.category.CategoryRepository;
import com.invetoryia.backend.movement.InventoryMovement;
import com.invetoryia.backend.movement.InventoryMovementRepository;
import com.invetoryia.backend.movement.MovementType;
import com.invetoryia.backend.product.Product;
import com.invetoryia.backend.product.ProductRepository;
import com.invetoryia.backend.supplier.Supplier;
import com.invetoryia.backend.supplier.SupplierRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryMovementRepository movementRepository;

    public DataSeeder(CategoryRepository categoryRepository,
                      ProductRepository productRepository,
                      SupplierRepository supplierRepository,
                      InventoryMovementRepository movementRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
        this.movementRepository = movementRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println("🌱 Verificando datos de prueba iniciales (Data Seeder V1 completo)...");

        // 1. Proveedores iniciales
        Supplier lenovo = getOrCreateSupplier("Lenovo Perú S.A.", "Carlos Mendoza", "ventas@lenovo.pe", "+51 987654321", "Av. Javier Prado 1230, Lima");
        Supplier nike = getOrCreateSupplier("Nike Distribuidora Oficial", "Ana Torres", "contacto@nikedistribucion.pe", "+51 912345678", "Av. Primavera 450, Lima");
        Supplier elSol = getOrCreateSupplier("Distribuidora Alimenticia El Sol", "Jorge Ramírez", "ventas@elsol.pe", "+51 955443322", "Av. Argentina 890, Callao");

        // 2. Categorías principales
        Category electronica = getOrCreateCategory("Electrónica", "Equipos de cómputo, dispositivos y gadgets inteligentes");
        Category ropa = getOrCreateCategory("Ropa y Calzado", "Prendas de vestir, calzado deportivo y accesorios de moda");
        Category hogar = getOrCreateCategory("Hogar y Oficina", "Mobiliario, iluminación y artículos de escritorio");
        Category abarrotes = getOrCreateCategory("Abarrotes y Alimentos", "Productos alimenticios, bebidas y provisiones");

        // 3. Productos de prueba
        List<Product> sampleProducts = List.of(
                new Product("PROD-ELE-001", "Laptop Lenovo ThinkPad T14", "Intel Core i7, 16GB RAM, 512GB SSD", new BigDecimal("1299.99"), 15, 5, electronica),
                new Product("PROD-ELE-002", "Monitor Dell UltraSharp 27\"", "Resolución 4K IPS, USB-C Hub", new BigDecimal("380.50"), 8, 3, electronica),
                new Product("PROD-ELE-003", "Teclado Mecánico Keychron K2", "Switches Brown, Retroiluminación RGB", new BigDecimal("95.00"), 2, 5, electronica),
                new Product("PROD-ELE-004", "Mouse Logitech MX Master 3S", "Sensor 8000 DPI, Clic silencioso", new BigDecimal("110.00"), 25, 5, electronica),

                new Product("PROD-ROP-001", "Polera Algodón Oversize Negro", "100% Algodón peruano premium", new BigDecimal("29.90"), 40, 10, ropa),
                new Product("PROD-ROP-002", "Zapatillas Running Nike Air Max", "Amortiguación de aire para carrera", new BigDecimal("120.00"), 4, 6, ropa),
                new Product("PROD-ROP-003", "Casaca Térmica Impermeable", "Forro polar interno resistente al agua", new BigDecimal("89.99"), 12, 4, ropa),

                new Product("PROD-HOG-001", "Silla Ergonómica de Oficina Pro", "Soporte lumbar ajustable y malla respirable", new BigDecimal("249.99"), 6, 3, hogar),
                new Product("PROD-HOG-002", "Escritorio Elevable Eléctrico", "Superficie 140x70cm con motor dual", new BigDecimal("350.00"), 3, 2, hogar),
                new Product("PROD-HOG-003", "Lámpara LED Regulable Escritorio", "Control táctil y puerto de carga USB", new BigDecimal("45.00"), 1, 4, hogar),

                new Product("PROD-ABA-001", "Café en Grano Premium 1kg", "Café de origen orgánico tostado medio", new BigDecimal("18.50"), 50, 15, abarrotes),
                new Product("PROD-ABA-002", "Aceite de Oliva Extra Virgen 1L", "Prensado en frío de acidez 0.2%", new BigDecimal("14.20"), 30, 10, abarrotes),
                new Product("PROD-ABA-003", "Té Verde Orgánico (50 sobres)", "Infusión natural antioxidante", new BigDecimal("8.00"), 5, 10, abarrotes)
        );

        for (Product p : sampleProducts) {
            if (!productRepository.existsBySku(p.getSku())) {
                Product saved = productRepository.save(p);

                // Registrar el movimiento de entrada inicial para cada producto nuevo
                Supplier s = p.getCategory().getName().equals("Electrónica") ? lenovo :
                             p.getCategory().getName().equals("Ropa y Calzado") ? nike : elSol;

                InventoryMovement initialMovement = new InventoryMovement(
                        saved,
                        MovementType.ENTRY,
                        saved.getStock(),
                        "Ingreso inicial de inventario (Stock inicial de apertura)",
                        s
                );
                movementRepository.save(initialMovement);
            }
        }

        System.out.println("✅ Data Seeder V1 completo ejecutado con éxito.");
    }

    private Supplier getOrCreateSupplier(String name, String contactName, String email, String phone, String address) {
        return supplierRepository.findAll().stream()
                .filter(s -> s.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> supplierRepository.save(new Supplier(name, contactName, email, phone, address)));
    }

    private Category getOrCreateCategory(String name, String description) {
        return categoryRepository.findAll().stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElseGet(() -> categoryRepository.save(new Category(name, description)));
    }
}
