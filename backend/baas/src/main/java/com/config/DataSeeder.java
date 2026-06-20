package com.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.model.Category;
import com.model.Product;
import com.repository.CategoryRepository;
import com.repository.ProductRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataSeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) return;

        Category caseiro = findOrCreate("Caseiro");
        Category diet = findOrCreate("Diet");
        Category vulcao = findOrCreate("Vulc\u00e3o");
        Category bolo = findOrCreate("Bolo");
        Category salgado = findOrCreate("Salgado");
        Category pudim = findOrCreate("Pudim");
        Category cesta = findOrCreate("Cesta");
        Category congelado = findOrCreate("Congelado");

        seedCaseiro(caseiro);
        seedDiet(diet);
        seedVulcao(vulcao);
        seedBolo(bolo);
        seedSalgado(salgado);
        seedPudim(pudim);
        seedCesta(cesta);
        seedCongelado(congelado);
    }

    private Category findOrCreate(String name) {
        return categoryRepository.findAll().stream()
                .filter(c -> c.getName().equals(name))
                .findFirst()
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(name);
                    return categoryRepository.save(c);
                });
    }

    private Product saveProduct(Category category, String name, String description, double price, List<String> ingredients) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setPrice(price);
        p.setCategory(category);
        p.setAvailable(true);
        p.setIngredients(ingredients);
        return productRepository.save(p);
    }

    private void seedCaseiro(Category cat) {
        saveProduct(cat, "Bolo de Cenoura", "Bolo de cenoura 45x45 com cobertura de chocolate", 65.00, List.of("Cenoura", "Chocolate", "Farinha de trigo", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo de Fub\u00e1", "Bolo de fub\u00e1 cremoso tradicional", 55.00, List.of("Fub\u00e1", "Leite", "Ovos", "A\u00e7\u00facar", "Queijo"));
        saveProduct(cat, "Bolo de Laranja", "Bolo de laranja com calda natural", 50.00, List.of("Laranja", "Farinha", "A\u00e7\u00facar", "Ovos", "\u00d3leo"));
        saveProduct(cat, "Bolo de Coco", "Bolo de coco com cobertura de coco queimado", 58.00, List.of("Coco ralado", "Leite de coco", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "P\u00e3o de Mel", "P\u00e3o de mel recheado com doce de leite", 45.00, List.of("Mel", "Chocolate", "Doce de leite", "Farinha", "Canela"));
        saveProduct(cat, "Biscoito de Nata", "Biscoito de nata caseiro polvilhado com a\u00e7\u00facar", 25.00, List.of("Nata", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Torta de Lim\u00e3o", "Torta de lim\u00e3o com merengue", 62.00, List.of("Lim\u00e3o", "Leite condensado", "Massa", "Ovos", "A\u00e7\u00facar"));
        saveProduct(cat, "Torta de Ma\u00e7\u00e3", "Torta de ma\u00e7\u00e3 com canela e crumble", 60.00, List.of("Ma\u00e7\u00e3", "Canela", "Massa", "A\u00e7\u00facar", "Manteiga"));
        saveProduct(cat, "Bolo de Banana", "Bolo de banana com aveia e canela", 48.00, List.of("Banana", "Aveia", "Canela", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Empadinha Caseira", "Empadinha de frango com catupiry (unidade)", 8.00, List.of("Frango", "Catupiry", "Massa podre", "Milho", "Azeitona"));
    }

    private void seedDiet(Category cat) {
        saveProduct(cat, "Bolo de Cenoura Fit", "Bolo de cenoura sem a\u00e7\u00facar e sem gl\u00faten", 52.00, List.of("Cenoura", "Aveia", "Mel", "Ovos", "\u00d3leo de coco"));
        saveProduct(cat, "Bolo de Coco Zero", "Bolo de coco sem lactose e sem a\u00e7\u00facar", 55.00, List.of("Coco", "Farinha de am\u00eandoas", "Ado\u00e7ante", "Ovos", "Leite vegetal"));
        saveProduct(cat, "Brownie Fit", "Brownie de chocolate com cacau 70% sem gl\u00faten", 42.00, List.of("Cacau 70%", "Farinha de am\u00eandoas", "Ado\u00e7ante", "Ovos", "Manteiga"));
        saveProduct(cat, "Torta de Lim\u00e3o Diet", "Torta de lim\u00e3o com base de castanhas", 58.00, List.of("Castanha do Par\u00e1", "Lim\u00e3o", "Leite condensado diet", "Ado\u00e7ante"));
        saveProduct(cat, "Muffin Integral", "Muffin integral de banana com aveia", 38.00, List.of("Banana", "Farinha integral", "Aveia", "Mel", "Ovos"));
        saveProduct(cat, "P\u00e3o de Mel Fit", "P\u00e3o de mel integral sem a\u00e7\u00facar", 48.00, List.of("Farinha integral", "Mel", "Chocolate 70%", "Canela"));
        saveProduct(cat, "Cookie de Aveia", "Cookie integral de aveia com gotas de chocolate", 32.00, List.of("Aveia", "Chocolate 70%", "Mel", "Manteiga"));
        saveProduct(cat, "Bolo de Laranja Fit", "Bolo de laranja integral sem a\u00e7\u00facar", 50.00, List.of("Laranja", "Farinha integral", "Ado\u00e7ante", "Ovos", "\u00d3leo de coco"));
        saveProduct(cat, "Cheesecake Fit", "Cheesecake de frutas vermelhas sem a\u00e7\u00facar", 65.00, List.of("Cream cheese", "Frutas vermelhas", "Base de castanhas", "Ado\u00e7ante"));
        saveProduct(cat, "Panqueca de Banana", "Panqueca de banana com whey protein (unidade)", 12.00, List.of("Banana", "Whey protein", "Aveia", "Ovos", "Canela"));
    }

    private void seedVulcao(Category cat) {
        saveProduct(cat, "Bolo Vulc\u00e3o de Chocolate", "Bolo de chocolate com recheio de brigadeiro derretido", 78.00, List.of("Chocolate", "Brigadeiro", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo Vulc\u00e3o de Doce de Leite", "Bolo de baunilha com vulc\u00e3o de doce de leite", 75.00, List.of("Doce de leite", "Baunilha", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo Vulc\u00e3o de Morango", "Bolo de nata com vulc\u00e3o de geleia de morango", 82.00, List.of("Morango", "Geleia", "Nata", "Farinha", "A\u00e7\u00facar"));
        saveProduct(cat, "Bolo Vulc\u00e3o de Coco", "Bolo de coco com vulc\u00e3o de beijinho", 72.00, List.of("Coco", "Leite condensado", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo Vulc\u00e3o de Ninho", "Bolo de leite Ninho com vulc\u00e3o de creme de Ninho", 80.00, List.of("Leite Ninho", "Leite condensado", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo Vulc\u00e3o de Prest\u00edgio", "Bolo de chocolate com vulc\u00e3o de coco e brigadeiro", 85.00, List.of("Chocolate", "Coco", "Brigadeiro", "Farinha", "A\u00e7\u00facar"));
        saveProduct(cat, "Bolo Vulc\u00e3o de Maracuj\u00e1", "Bolo de maracuj\u00e1 com vulc\u00e3o de creme de maracuj\u00e1", 76.00, List.of("Maracuj\u00e1", "Leite condensado", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo Vulc\u00e3o de Romeu e Julieta", "Bolo de queijo com vulc\u00e3o de goiabada", 78.00, List.of("Queijo", "Goiabada", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo Vulc\u00e3o de Amendoim", "Bolo de amendoim com vulc\u00e3o de pa\u00e7oca", 74.00, List.of("Amendoim", "Pa\u00e7oca", "Leite condensado", "Farinha", "A\u00e7\u00facar"));
        saveProduct(cat, "Bolo Vulc\u00e3o de Oreo", "Bolo de baunilha com vulc\u00e3o de creme de Oreo", 86.00, List.of("Oreo", "Baunilha", "Farinha", "A\u00e7\u00facar", "Ovos"));
    }

    private void seedBolo(Category cat) {
        saveProduct(cat, "Bolo de Chocolate", "Bolo de chocolate com cobertura de ganache", 70.00, List.of("Chocolate", "Creme de leite", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo de Baunilha", "Bolo de baunilha com recheio de brigadeiro branco", 68.00, List.of("Baunilha", "Leite condensado", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo de Morango", "Bolo de nata com morangos frescos", 75.00, List.of("Morango", "Nata", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo de Lim\u00e3o", "Bolo de lim\u00e3o com cobertura de merengue", 62.00, List.of("Lim\u00e3o", "Merengue", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo de Coco Cremoso", "Bolo de coco com recheio cremoso", 66.00, List.of("Coco", "Leite condensado", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo de Milho", "Bolo de milho cremoso tradicional", 58.00, List.of("Milho", "Leite de coco", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo de Amendoim", "Bolo de amendoim com cobertura de pa\u00e7oca", 64.00, List.of("Amendoim", "Pa\u00e7oca", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo de Iogurte", "Bolo de iogurte natural com frutas", 60.00, List.of("Iogurte", "Frutas", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Bolo Red Velvet", "Bolo red velvet com cream cheese frosting", 85.00, List.of("Cream cheese", "Corante", "Farinha", "A\u00e7\u00facar", "Ovos", "Manteiga"));
        saveProduct(cat, "Bolo de Cerveja Preta", "Bolo de cerveja preta com calda de caramelo", 72.00, List.of("Cerveja preta", "Caramelo", "Farinha", "A\u00e7\u00facar", "Ovos"));
    }

    private void seedSalgado(Category cat) {
        saveProduct(cat, "Coxinha de Frango", "Coxinha de frango com catupiry (unidade)", 7.00, List.of("Frango", "Catupiry", "Farinha", "Temperos"));
        saveProduct(cat, "Empada de Frango", "Empada de frango com milho e azeitona (unidade)", 8.00, List.of("Frango", "Milho", "Azeitona", "Massa podre"));
        saveProduct(cat, "Empada de Palmito", "Empada de palmito (unidade)", 9.00, List.of("Palmito", "Azeitona", "Massa podre"));
        saveProduct(cat, "Risole de Carne", "Risole de carne mo\u00edda (unidade)", 7.00, List.of("Carne mo\u00edda", "Farinha", "Temperos"));
        saveProduct(cat, "Kibe", "Kibe frito tradicional (unidade)", 6.00, List.of("Carne mo\u00edda", "Trigo para kibe", "Hortel\u00e3", "Temperos"));
        saveProduct(cat, "Esfiha de Carne", "Esfiha aberta de carne (unidade)", 7.00, List.of("Carne mo\u00edda", "Massa", "Temperos", "Lim\u00e3o"));
        saveProduct(cat, "Esfiha de Queijo", "Esfiha de queijo com or\u00e9gano (unidade)", 7.00, List.of("Queijo", "Or\u00e9gano", "Massa"));
        saveProduct(cat, "Pastel Assado", "Pastel assado de frango (unidade)", 6.00, List.of("Frango", "Catupiry", "Massa"));
        saveProduct(cat, "Enroladinho de Salsicha", "Enroladinho de salsicha assado (unidade)", 5.00, List.of("Salsicha", "Massa", "Queijo"));
        saveProduct(cat, "Torta Salgada", "Torta salgada de frango e milho (m\u00e9dia)", 55.00, List.of("Frango", "Milho", "Massa", "Creme de leite", "Queijo"));
    }

    private void seedPudim(Category cat) {
        saveProduct(cat, "Pudim de Leite", "Pudim de leite condensado tradicional", 45.00, List.of("Leite condensado", "Leite", "Ovos", "A\u00e7\u00facar"));
        saveProduct(cat, "Pudim de Chocolate", "Pudim de chocolate com calda de brigadeiro", 52.00, List.of("Chocolate", "Leite condensado", "Ovos", "A\u00e7\u00facar"));
        saveProduct(cat, "Pudim de Coco", "Pudim de coco com calda de caramelo", 50.00, List.of("Coco", "Leite condensado", "Ovos", "A\u00e7\u00facar"));
        saveProduct(cat, "Pudim de Leite Ninho", "Pudim de leite Ninho cremoso", 55.00, List.of("Leite Ninho", "Leite condensado", "Ovos", "A\u00e7\u00facar"));
        saveProduct(cat, "Pudim de Doce de Leite", "Pudim de doce de leite com calda", 53.00, List.of("Doce de leite", "Leite", "Ovos", "A\u00e7\u00facar"));
        saveProduct(cat, "Pudim de Maracuj\u00e1", "Pudim de maracuj\u00e1 com calda azedinha", 50.00, List.of("Maracuj\u00e1", "Leite condensado", "Ovos", "A\u00e7\u00facar"));
        saveProduct(cat, "Pudim de Pa\u00e7oca", "Pudim de pa\u00e7oca com calda de amendoim", 54.00, List.of("Amendoim", "Pa\u00e7oca", "Leite condensado", "Ovos", "A\u00e7\u00facar"));
        saveProduct(cat, "Pudim de Caf\u00e9", "Pudim de caf\u00e9 com calda de caramelo", 52.00, List.of("Caf\u00e9", "Leite condensado", "Ovos", "A\u00e7\u00facar"));
        saveProduct(cat, "Pudim Fit", "Pudim diet sem a\u00e7\u00facar", 48.00, List.of("Leite condensado diet", "Ovos", "Ado\u00e7ante"));
        saveProduct(cat, "Pudim de Queijo", "Pudim de queijo com goiabada", 56.00, List.of("Queijo", "Goiabada", "Leite condensado", "Ovos", "A\u00e7\u00facar"));
    }

    private void seedCesta(Category cat) {
        saveProduct(cat, "Cesta Manh\u00e3 Especial", "Cesta com p\u00e3o de mel, bolo e suco", 89.00, List.of("P\u00e3o de mel", "Bolo de cenoura", "Suco natural"));
        saveProduct(cat, "Cesta Caf\u00e9 da Tarde", "Cesta com variedade de quitandas", 75.00, List.of("Biscoitos", "Bolo de fub\u00e1", "Torradas", "Gel\u00e9ia"));
        saveProduct(cat, "Cesta Rom\u00e2ntica", "Cesta para casal com champanhe e doces finos", 150.00, List.of("Champanhe", "Doces finos", "Bombons", "Flores"));
        saveProduct(cat, "Cesta de P\u00e1scoa", "Cesta tem\u00e1tica com ovos de p\u00e1scoa artesanais", 120.00, List.of("Ovo de p\u00e1scoa", "Bombons", "Coelho de pel\u00facia"));
        saveProduct(cat, "Cesta Anivers\u00e1rio", "Cesta com bolo personalizado e salgados", 130.00, List.of("Bolo personalizado", "Coxinha", "Empada", "Docinhos"));
        saveProduct(cat, "Cesta Natalina", "Cesta de Natal com panetone e frutas secas", 160.00, List.of("Panetone", "Frutas secas", "Castanhas", "Vinho"));
        saveProduct(cat, "Cesta Fit", "Cesta com produtos diet e integrais", 95.00, List.of("Bolo fit", "Cookie integral", "P\u00e3o de mel diet", "Suco detox"));
        saveProduct(cat, "Mini Cesta", "Mini cesta com 3 doces variados", 45.00, List.of("Brigadeiro", "Beijinho", "Cajuzinho"));
        saveProduct(cat, "Cesta de Doces Finos", "Cesta com variedade de doces gourmet", 110.00, List.of("Trufas", "Mousses", "Copinhos da felicidade", "Bombons"));
        saveProduct(cat, "Cesta Empresarial", "Cesta corporativa com caf\u00e9 especial e biscoitos", 135.00, List.of("Caf\u00e9 especial", "Biscoitos finos", "P\u00e3o de mel", "Geleia"));
    }

    private void seedCongelado(Category cat) {
        saveProduct(cat, "Bolo de Chocolate Congelado", "Bolo de chocolate pronto para servir (rende 15 fatias)", 80.00, List.of("Chocolate", "Farinha", "A\u00e7\u00facar", "Ovos", "Creme de leite"));
        saveProduct(cat, "Bolo de Cenoura Congelado", "Bolo de cenoura congelado com cobertura", 75.00, List.of("Cenoura", "Chocolate", "Farinha", "A\u00e7\u00facar", "Ovos"));
        saveProduct(cat, "Torta de Frango Congelada", "Torta salgada de frango congelada (m\u00e9dia)", 50.00, List.of("Frango", "Massa", "Milho", "Creme de leite"));
        saveProduct(cat, "Empadinhas Congeladas (12 unid)", "12 empadinhas de frango congeladas", 45.00, List.of("Frango", "Catupiry", "Massa podre"));
        saveProduct(cat, "Coxinhas Congeladas (20 unid)", "20 coxinhas de frango congeladas", 55.00, List.of("Frango", "Massa", "Temperos"));
        saveProduct(cat, "P\u00e3o de Mel Congelado", "P\u00e3o de mel congelado recheado (10 unid)", 50.00, List.of("Mel", "Chocolate", "Doce de leite", "Farinha"));
        saveProduct(cat, "Pudim Congelado", "Pudim de leite congelado (rende 10 fatias)", 55.00, List.of("Leite condensado", "Leite", "Ovos", "A\u00e7\u00facar"));
        saveProduct(cat, "Massa de Pastel Congelada", "Massa de pastel para fritar (20 discos)", 25.00, List.of("Farinha", "\u00d3leo", "Sal"));
        saveProduct(cat, "Biscoitos Congelados (30 unid)", "30 biscoitos de nata congelados para assar", 35.00, List.of("Nata", "Farinha", "A\u00e7\u00facar"));
        saveProduct(cat, "Kit Festa Congelado", "Kit com 50 salgadinhos variados congelados", 70.00, List.of("Coxinha", "Empada", "Kibe", "Risole"));
    }
}
